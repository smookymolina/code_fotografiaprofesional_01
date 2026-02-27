import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../api/client'
import { ApiInvitation, InvitationTemplate } from './invitationTypes'

const TEMPLATES: Array<{ id: InvitationTemplate; label: string; desc: string; gradient: string; isDark: boolean }> = [
  {
    id: 'warm',
    label: 'Cálida',
    desc: 'Cremas suaves y dorado miel',
    gradient: 'linear-gradient(135deg, #fdf6ee 0%, #f0e0c8 50%, #e8d5b8 100%)',
    isDark: false,
  },
  {
    id: 'floral',
    label: 'Floral',
    desc: 'Rosa polvoso y romanticismo',
    gradient: 'linear-gradient(135deg, #fdf0f4 0%, #f4d8e8 50%, #ecc8dc 100%)',
    isDark: false,
  },
  {
    id: 'rustic',
    label: 'Rústica',
    desc: 'Tierra oscura, detalles dorados',
    gradient: 'linear-gradient(135deg, #1e1008 0%, #2d1a0a 50%, #1e1208 100%)',
    isDark: true,
  },
  {
    id: 'moderno',
    label: 'Moderno',
    desc: 'Navy elegante y líneas limpias',
    gradient: 'linear-gradient(135deg, #08101e 0%, #0f1a30 50%, #08101e 100%)',
    isDark: true,
  },
]

const STEPS = [
  'Plantilla',
  'Datos',
  'Contenido',
  'Galeria',
  'Publicar',
]

interface InvitationDraft {
  title: string
  eventType: string
  eventDate: string
  template: InvitationTemplate
  isPublished: boolean
  ownerName?: string
  ownerEmail?: string
  clientId?: string
  data: {
    title: string
    names: string
    eventType: string
    date: string
    time: string
    venue: string
    locationNote: string
    message: string
    quote: string
    hashtag: string
    dressCode: string
    rsvpLabel: string
    rsvpValue: string
  }
}

const emptyDraft: InvitationDraft = {
  title: 'Invitacion digital',
  eventType: 'Boda',
  eventDate: '',
  template: 'floral',
  isPublished: false,
  data: {
    title: 'Estas invitado a nuestra boda',
    names: '',
    eventType: 'Boda',
    date: '',
    time: '',
    venue: '',
    locationNote: '',
    message: '',
    quote: '',
    hashtag: '#NuestraHistoria',
    dressCode: '',
    rsvpLabel: 'Confirmar asistencia',
    rsvpValue: '',
  },
}

export default function InvitationWizard({
  onClose,
  onSave,
  ownerName,
  ownerEmail,
  mode = 'client',
}: {
  onClose: () => void
  onSave: (invitation: ApiInvitation) => void
  ownerName?: string
  ownerEmail?: string
  mode?: 'client' | 'admin'
}) {
  const showOwnerFields = !ownerName || !ownerEmail
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<InvitationDraft>({
    ...emptyDraft,
    ownerName,
    ownerEmail,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const setField = (field: keyof InvitationDraft) => (value: string | boolean | InvitationTemplate) =>
    setDraft(prev => ({ ...prev, [field]: value as never }))

  const setData = (field: keyof InvitationDraft['data']) => (value: string | number) =>
    setDraft(prev => ({ ...prev, data: { ...prev.data, [field]: value } }))

  const setDataAndTop = (
    field: keyof InvitationDraft['data'],
    topField: keyof InvitationDraft
  ) => (value: string) =>
    setDraft(prev => ({
      ...prev,
      [topField]: value as never,
      data: { ...prev.data, [field]: value },
    }))

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      if (mode === 'admin' && !draft.clientId) {
        setError('Client ID requerido para admin')
        setIsSaving(false)
        return
      }
      const payload: Record<string, unknown> = {
        eventType: draft.data.eventType,
        title: draft.data.title,
        names: draft.data.names,
        eventDate: draft.data.date,
        eventTime: draft.data.time,
        venue: draft.data.venue,
        locationNote: draft.data.locationNote,
        message: draft.data.message,
        quote: draft.data.quote,
        hashtag: draft.data.hashtag,
        template: draft.template,
        dressCode: draft.data.dressCode,
        rsvpLabel: draft.data.rsvpLabel,
        rsvpValue: draft.data.rsvpValue,
        isPublished: draft.isPublished,
      }

      if (mode === 'admin') {
        payload.clientId = draft.clientId
      }

      const endpoint = mode === 'admin' ? '/admin/invitations' : '/client/invitations'
      const res = await api.post<{ data: ApiInvitation }>(endpoint, payload)
      let saved = res.data

      if (photos.length > 0) {
        const form = new FormData()
        photos.forEach(photo => form.append('images', photo))
        const uploadEndpoint = mode === 'admin'
          ? `/admin/invitations/${saved.id}/photos`
          : `/client/invitations/${saved.id}/photos`
        const uploaded = await api.postForm<{ data: ApiInvitation }>(uploadEndpoint, form)
        saved = uploaded.data
      }

      onSave(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la invitacion')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-3xl glass rounded-2xl border border-white/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="label-caps text-gold text-xs">Invitacion digital</p>
            <h3 className="font-cormorant text-xl text-ivory">Wizard en 5 pasos</h3>
          </div>
          <button onClick={onClose} className="text-ivory/40 hover:text-ivory text-sm">
            Cerrar
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/5 flex gap-2">
          {STEPS.map((label, idx) => (
            <div
              key={label}
              className={`flex-1 rounded-full text-[0.6rem] uppercase tracking-[0.25em] px-3 py-2 text-center ${
                idx === step ? 'bg-gold/20 text-gold' : 'bg-white/5 text-ivory/40'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setField('template')(tpl.id)}
                  className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                    draft.template === tpl.id
                      ? 'border-gold bg-gold/10 scale-[1.02]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Template gradient preview */}
                  <div
                    className="h-24 rounded-lg mb-4 relative overflow-hidden"
                    style={{ background: tpl.gradient }}
                  >
                    {/* Mini ornament */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <div
                        className="h-px w-8"
                        style={{ background: tpl.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }}
                      />
                      <div
                        className="w-1.5 h-1.5 rotate-45"
                        style={{ background: tpl.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }}
                      />
                      <div
                        className="h-px w-8"
                        style={{ background: tpl.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }}
                      />
                    </div>
                  </div>
                  <h4 className="font-dm text-ivory text-sm font-medium">{tpl.label}</h4>
                  <p className="text-ivory/40 text-xs mt-0.5">{tpl.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Titulo</label>
                <input
                  value={draft.data.title}
                  onChange={e => setDataAndTop('title', 'title')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="Titulo principal"
                />
              </div>
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Nombres</label>
                <input
                  value={draft.data.names}
                  onChange={e => setData('names')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="Ej. Ana & Carlos"
                />
              </div>
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Tipo de evento</label>
                <input
                  value={draft.data.eventType}
                  onChange={e => setDataAndTop('eventType', 'eventType')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="Boda, XV, Cumple"
                />
              </div>
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Fecha</label>
                <input
                  value={draft.data.date}
                  onChange={e => setDataAndTop('date', 'eventDate')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="12 junio 2026"
                />
              </div>
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Hora</label>
                <input
                  value={draft.data.time}
                  onChange={e => setData('time')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="18:00"
                />
              </div>
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Lugar</label>
                <input
                  value={draft.data.venue}
                  onChange={e => setData('venue')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="Hacienda San Miguel"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Nota de ubicacion</label>
                <input
                  value={draft.data.locationNote}
                  onChange={e => setData('locationNote')(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                  placeholder="Ciudad, pais"
                />
              </div>
              {showOwnerFields && (
                <>
                  <div>
                    <label className="block text-ivory/60 text-xs font-dm mb-1.5">Cliente</label>
                    <input
                      value={draft.ownerName || ''}
                      onChange={e => setField('ownerName')(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-ivory/60 text-xs font-dm mb-1.5">Email del cliente</label>
                    <input
                      type="email"
                      value={draft.ownerEmail || ''}
                      onChange={e => setField('ownerEmail')(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </>
              )}
              {mode === 'admin' && (
                <div className="md:col-span-2">
                  <label className="block text-ivory/60 text-xs font-dm mb-1.5">Client ID</label>
                  <input
                    value={draft.clientId || ''}
                    onChange={e => setField('clientId')(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none"
                    placeholder="Pega el ID del cliente"
                  />
                  <p className="text-ivory/30 text-xs mt-2">
                    Toma el ID desde la lista de clientes en el panel admin.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Mensaje', field: 'message' },
                { label: 'Cita', field: 'quote' },
                { label: 'Dress code', field: 'dressCode' },
                { label: 'Hashtag', field: 'hashtag' },
              ].map(item => (
                <div key={item.field} className={item.field === 'message' || item.field === 'quote' ? 'md:col-span-2' : ''}>
                  <label className="block text-ivory/60 text-xs font-dm mb-1.5">{item.label}</label>
                  <textarea
                    rows={item.field === 'message' || item.field === 'quote' ? 3 : 2}
                    value={(draft.data as any)[item.field]}
                    onChange={e => setData(item.field as keyof InvitationDraft['data'])(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm placeholder-ivory/20 focus:border-gold/50 focus:outline-none resize-none"
                    placeholder={item.label}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-ivory/60 text-xs font-dm mb-1.5">Subir fotos</label>
                <input
                  type="file"
                  multiple
                  onChange={e => setPhotos(Array.from(e.target.files || []))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory/60 text-sm"
                />
                <p className="text-ivory/30 text-xs mt-2">
                  {photos.length > 0 ? `${photos.length} fotos seleccionadas` : 'Puedes subir hasta 8 fotos.'}
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ivory/60 text-xs font-dm mb-1.5">Etiqueta RSVP</label>
                  <input
                    value={draft.data.rsvpLabel}
                    onChange={e => setData('rsvpLabel')(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ivory/60 text-xs font-dm mb-1.5">Contacto RSVP</label>
                  <input
                    value={draft.data.rsvpValue}
                    onChange={e => setData('rsvpValue')(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-ivory text-sm focus:border-gold/50 focus:outline-none"
                    placeholder="WhatsApp o telefono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                <div>
                  <p className="text-ivory text-sm font-dm">Publicar invitacion</p>
                  <p className="text-ivory/40 text-xs">Activa el enlace y el QR</p>
                </div>
                <button
                  onClick={() => setField('isPublished')(!draft.isPublished)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    draft.isPublished ? 'bg-gold' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                      draft.isPublished ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex items-center gap-2 text-ivory/60 text-xs font-dm">
                  <CheckCircle size={14} className="text-gold" />
                  Se generara un link y QR al guardar.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          {error && (
            <p className="text-red-400 text-xs font-dm">{error}</p>
          )}
          <button
            onClick={prev}
            disabled={step === 0}
            className="btn-outline px-4 py-2 text-xs disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary px-5 py-2 text-xs">
              Siguiente
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-5 py-2 text-xs disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : 'Guardar invitacion'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
