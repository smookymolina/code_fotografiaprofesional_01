export type InvitationTemplate = 'warm' | 'floral' | 'rustic' | 'moderno'

export interface ApiInvitation {
  id: string
  clientId?: string
  eventType: string
  title: string
  names: string
  eventDate: string
  eventTime?: string
  venue?: string
  locationNote?: string
  message?: string
  quote?: string
  hashtag?: string
  template: InvitationTemplate | string
  primaryColor?: string
  textColor?: string
  fontStyle?: string
  isDark?: boolean
  dressCode?: string
  rsvpLabel?: string
  rsvpValue?: string
  gallery?: string[]
  shareToken: string
  views: number
  isPublished: boolean
  createdAt: string
  client?: { id: string; name: string; email: string }
}

export const demoInvitation: ApiInvitation = {
  id: 'demo',
  eventType: 'Boda',
  title: 'Estas invitado a nuestra boda',
  names: 'Elizabeth & Salomon',
  eventDate: '12 junio 2026',
  eventTime: '18:00',
  venue: 'Hacienda San Rafael',
  locationNote: 'Queretaro, Mexico',
  message: 'El amor contigo es un viaje sin fin, y cada dia es una nueva aventura.',
  quote: 'Amar es encontrar en la felicidad de otro tu propia felicidad.',
  hashtag: '#BodaElizabethSalomon',
  template: 'rustic',
  primaryColor: '#b07b4b',
  textColor: '#2b1a10',
  dressCode: 'Etiqueta formal, tonos claros',
  rsvpLabel: 'Confirmar asistencia',
  rsvpValue: 'WhatsApp: +52 555 123 4567',
  gallery: [],
  shareToken: 'demo',
  views: 0,
  isPublished: true,
  createdAt: new Date().toISOString(),
}
