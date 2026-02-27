import { Response } from 'express'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../utils/prisma'
import { AuthRequest } from '../types'
import * as R from '../utils/response'
import { sendBookingConfirmation } from '../utils/email'

// ─── RESERVAS DEL CLIENTE ──────────────────────────────────────────────────────

export async function getMyBookings(req: AuthRequest, res: Response): Promise<void> {
  const bookings = await prisma.booking.findMany({
    where: { clientId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
  })
  R.success(res, bookings)
}

export async function getMyBooking(req: AuthRequest, res: Response): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!booking) { R.notFound(res, 'Reserva no encontrada'); return }
  R.success(res, booking)
}

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    R.badRequest(res, 'Datos inválidos', errors.array().map(e => e.msg).join(', '))
    return
  }

  const { service, eventDate, eventType, venue, guestCount, budget, notes } = req.body

  const booking = await prisma.booking.create({
    data: {
      clientId: req.user!.userId,
      service,
      eventDate: new Date(eventDate),
      eventType,
      venue,
      guestCount: guestCount ? Number(guestCount) : undefined,
      budget: budget ? Number(budget) : undefined,
      notes,
    },
  })

  // Notificación por email
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } })
  if (user) {
    sendBookingConfirmation({
      to: user.email,
      name: user.name,
      service,
      eventDate: new Date(eventDate).toLocaleDateString('es-MX'),
      bookingId: booking.id,
    }).catch(console.error)
  }

  R.created(res, booking, 'Reserva creada. Te contactaremos para confirmar los detalles.')
}

export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!booking) { R.notFound(res, 'Reserva no encontrada'); return }
  if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
    R.badRequest(res, 'Esta reserva no se puede cancelar'); return
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
  })
  R.success(res, updated, 'Reserva cancelada')
}

// ─── INVITACIONES DIGITALES DEL CLIENTE ───────────────────────────────────────

export async function getMyInvitations(req: AuthRequest, res: Response): Promise<void> {
  const invitations = await prisma.digitalInvitation.findMany({
    where: { clientId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
  })
  R.success(res, invitations)
}

export async function getMyInvitation(req: AuthRequest, res: Response): Promise<void> {
  const invitation = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!invitation) { R.notFound(res, 'Invitación no encontrada'); return }
  R.success(res, invitation)
}

export async function createInvitation(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    R.badRequest(res, 'Datos inválidos', errors.array().map(e => e.msg).join(', '))
    return
  }

  const {
    eventType, title, names, eventDate, eventTime, venue, message,
    template, primaryColor, textColor, fontStyle, isDark, dressCode, rsvpContact,
  } = req.body

  const shareToken = uuidv4()

  const invitation = await prisma.digitalInvitation.create({
    data: {
      clientId: req.user!.userId,
      eventType, title, names, eventDate, eventTime, venue, message,
      template: template || 'elegante',
      primaryColor: primaryColor || '#1a2744',
      textColor: textColor || '#F5F0E8',
      fontStyle: fontStyle || 'serif',
      isDark: isDark !== false,
      dressCode, rsvpContact,
      shareToken,
    },
  })
  R.created(res, invitation, 'Invitación creada exitosamente')
}

export async function updateInvitation(req: AuthRequest, res: Response): Promise<void> {
  const existing = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!existing) { R.notFound(res, 'Invitación no encontrada'); return }

  const invitation = await prisma.digitalInvitation.update({
    where: { id: req.params.id },
    data: req.body,
  })
  R.success(res, invitation, 'Invitación actualizada')
}

export async function deleteInvitation(req: AuthRequest, res: Response): Promise<void> {
  const existing = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!existing) { R.notFound(res, 'Invitación no encontrada'); return }

  await prisma.digitalInvitation.delete({ where: { id: req.params.id } })
  R.noContent(res)
}

export async function toggleInvitationPublished(req: AuthRequest, res: Response): Promise<void> {
  const existing = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!existing) { R.notFound(res, 'Invitación no encontrada'); return }

  const updated = await prisma.digitalInvitation.update({
    where: { id: req.params.id },
    data: { isPublished: !existing.isPublished },
  })
  R.success(res, updated, `Invitación ${updated.isPublished ? 'publicada' : 'despublicada'}`)
}
