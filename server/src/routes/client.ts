import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth'
import { requireClient } from '../middleware/roles'
import * as client from '../controllers/clientController'

const router = Router()

// Todas las rutas cliente requieren autenticación
router.use(authenticate, requireClient)

const bookingValidation = [
  body('service').trim().notEmpty().withMessage('El servicio es requerido'),
  body('eventDate').isISO8601().withMessage('Fecha inválida'),
  body('eventType').trim().notEmpty().withMessage('El tipo de evento es requerido'),
]

const invitationValidation = [
  body('eventType').trim().notEmpty().withMessage('El tipo de evento es requerido'),
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('names').trim().notEmpty().withMessage('Los nombres son requeridos'),
  body('eventDate').trim().notEmpty().withMessage('La fecha es requerida'),
]

// Reservas
router.get('/bookings', client.getMyBookings)
router.get('/bookings/:id', client.getMyBooking)
router.post('/bookings', bookingValidation, client.createBooking)
router.patch('/bookings/:id/cancel', client.cancelBooking)

// Invitaciones digitales
router.get('/invitations', client.getMyInvitations)
router.get('/invitations/:id', client.getMyInvitation)
router.post('/invitations', invitationValidation, client.createInvitation)
router.put('/invitations/:id', client.updateInvitation)
router.delete('/invitations/:id', client.deleteInvitation)
router.patch('/invitations/:id/toggle-published', client.toggleInvitationPublished)

export default router
