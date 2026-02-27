import { Router } from 'express'
import prisma from '../utils/prisma'
import * as R from '../utils/response'

const router = Router()

// GET /api/public/portfolio
router.get('/portfolio', async (req, res) => {
  const { category, featured } = req.query
  const where: Record<string, unknown> = { isVisible: true }
  if (category) where.category = String(category)
  if (featured === 'true') where.featured = true

  const items = await prisma.portfolioItem.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  })
  R.success(res, items)
})

// GET /api/public/testimonials
router.get('/testimonials', async (_req, res) => {
  const items = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })
  R.success(res, items)
})

// GET /api/public/services
router.get('/services', async (_req, res) => {
  const items = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
  const parsed = items.map(s => ({
    ...s,
    features: JSON.parse(s.features || '[]'),
  }))
  R.success(res, parsed)
})

// GET /api/public/settings
router.get('/settings', async (_req, res) => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  R.success(res, settings)
})

// GET /api/public/invitation/:token  — vista pública de invitación
router.get('/invitation/:token', async (req, res) => {
  const invitation = await prisma.digitalInvitation.findUnique({
    where: { shareToken: req.params.token },
  })
  if (!invitation || !invitation.isPublished) {
    R.notFound(res, 'Invitación no encontrada')
    return
  }
  // Incrementar contador de vistas
  await prisma.digitalInvitation.update({
    where: { id: invitation.id },
    data: { views: { increment: 1 } },
  })
  R.success(res, invitation)
})

export default router
