import { Response } from 'express'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../utils/prisma'
import { AuthRequest } from '../types'
import * as R from '../utils/response'
import { sendBookingConfirmation } from '../utils/email'

function parseGallery(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizeInvitation(invitation: any) {
  return {
    ...invitation,
    gallery: parseGallery(invitation.gallery),
  }
}

function serializeGallery(input: unknown): string | undefined {
  if (!input) return undefined
  if (Array.isArray(input)) return JSON.stringify(input)
  if (typeof input === 'string') return input
  return undefined
}

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
  R.success(res, invitations.map(normalizeInvitation))
}

export async function getMyInvitation(req: AuthRequest, res: Response): Promise<void> {
  const invitation = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!invitation) { R.notFound(res, 'Invitación no encontrada'); return }
  R.success(res, normalizeInvitation(invitation))
}

export async function createInvitation(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    R.badRequest(res, 'Datos inválidos', errors.array().map(e => e.msg).join(', '))
    return
  }

  const {
    eventType, title, names, eventDate, eventTime, venue, locationNote,
    message, quote, hashtag, template, primaryColor, textColor, fontStyle,
    isDark, dressCode, rsvpLabel, rsvpValue, rsvpContact, gallery, isPublished,
  } = req.body

  const shareToken = uuidv4()
  const resolvedRsvp = rsvpValue || rsvpContact

  const invitation = await prisma.digitalInvitation.create({
    data: {
      clientId: req.user!.userId,
      eventType, title, names, eventDate, eventTime, venue, locationNote,
      message, quote, hashtag,
      template: template || 'elegante',
      primaryColor: primaryColor || '#1a2744',
      textColor: textColor || '#F5F0E8',
      fontStyle: fontStyle || 'serif',
      isDark: isDark !== false,
      isPublished: isPublished !== false,
      dressCode,
      rsvpLabel,
      rsvpValue: resolvedRsvp,
      gallery: serializeGallery(gallery),
      shareToken,
    },
  })
  R.created(res, normalizeInvitation(invitation), 'Invitación creada exitosamente')
}

export async function updateInvitation(req: AuthRequest, res: Response): Promise<void> {
  const existing = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!existing) { R.notFound(res, 'Invitación no encontrada'); return }

  const payload = { ...req.body }
  if (payload.gallery) {
    payload.gallery = serializeGallery(payload.gallery)
  }
  if (payload.rsvpContact && !payload.rsvpValue) {
    payload.rsvpValue = payload.rsvpContact
  }

  const invitation = await prisma.digitalInvitation.update({
    where: { id: req.params.id },
    data: payload,
  })
  R.success(res, normalizeInvitation(invitation), 'Invitación actualizada')
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
  R.success(res, normalizeInvitation(updated), `Invitación ${updated.isPublished ? 'publicada' : 'despublicada'}`)
}

export async function addInvitationPhotos(req: AuthRequest, res: Response): Promise<void> {
  const existing = await prisma.digitalInvitation.findFirst({
    where: { id: req.params.id, clientId: req.user!.userId },
  })
  if (!existing) { R.notFound(res, 'Invitación no encontrada'); return }

  const files = (req.files || []) as Express.Multer.File[]
  const urls = files.map(file => `/uploads/${file.filename}`)
  const current = parseGallery(existing.gallery)
  const updated = await prisma.digitalInvitation.update({
    where: { id: existing.id },
    data: { gallery: JSON.stringify([...current, ...urls]) },
  })
  R.success(res, normalizeInvitation(updated), 'Fotos agregadas')
}
