import { useEffect, useState } from 'react'
import { Mail, Eye, Trash2, Plus } from 'lucide-react'
import InvitationWizard from '../invitations/InvitationWizard'
import api from '../../api/client'
import { ApiInvitation } from '../invitations/invitationTypes'

export default function AdminInvitations() {
  const [invitations, setInvitations] = useState<ApiInvitation[]>([])
  const [showWizard, setShowWizard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    setIsLoading(true)
    try {
      const res = await api.get<{ data: ApiInvitation[] }>('/admin/invitations')
      setInvitations(res.data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-ivory/50 text-sm font-dm">{invitations.length} invitaciones</p>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm"
        >
          <Plus size={16} />
          Nueva invitacion
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : invitations.length === 0 ? (
        <div className="glass rounded-xl border border-white/5 p-12 text-center">
          <Mail className="mx-auto text-ivory/20 mb-4" size={40} />
          <p className="text-ivory/40 font-dm">No hay invitaciones creadas</p>
          <p className="text-ivory/30 text-sm font-dm mt-2">
            Crea una plantilla y asignala a un cliente.
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Titulo', 'Cliente', 'Evento', 'Fecha', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-ivory/40 text-xs font-dm uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invitations.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-ivory text-sm font-dm">{inv.title}</td>
                    <td className="px-4 py-3 text-ivory/60 text-sm font-dm">
                      {inv.client?.name || inv.client?.email || 'Sin cliente'}
                    </td>
                    <td className="px-4 py-3 text-ivory/60 text-sm font-dm">{inv.eventType}</td>
                    <td className="px-4 py-3 text-ivory/50 text-xs font-dm">{inv.eventDate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => {
                          await api.patch(`/admin/invitations/${inv.id}/toggle-published`)
                          refresh()
                        }}
                        className={`text-xs font-dm px-2 py-1 rounded-full ${
                          inv.isPublished ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'
                        }`}
                      >
                        {inv.isPublished ? 'Publicada' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs font-dm">
                        <a
                          href={`/invitacion/${inv.shareToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:text-gold-light inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          Ver
                        </a>
                        <button
                          onClick={async () => {
                            await api.delete(`/admin/invitations/${inv.id}`)
                            refresh()
                          }}
                          className="text-ivory/40 hover:text-danger inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showWizard && (
        <InvitationWizard
          onClose={() => setShowWizard(false)}
          onSave={() => {
            refresh()
            setShowWizard(false)
          }}
          mode="admin"
        />
      )}
    </div>
  )
}
