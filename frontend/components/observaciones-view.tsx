'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Plus, Pencil, Trash2, Save, X, Search, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastContainer } from '@/components/toast-container'
import { useToasts } from '@/hooks/use-toasts'

const observacionSchema = z.object({
  participanteId: z.string().min(1, 'Selecciona un participante'),
  tareaId: z.string().min(1, 'Selecciona una tarea'),
  exito: z.boolean(),
  tiempoSegundos: z.number().min(1).max(3600),
  cantidadErrores: z.number().min(0).max(50),
  comentarios: z.string().max(5000).optional(),
  problemaDetectado: z.string().max(5000).optional(),
  severidad: z.enum(['baja', 'media', 'alta', 'critica']).optional(),
  mejoraPropuesta: z.string().max(5000).optional(),
})

type ObservacionFormValues = z.infer<typeof observacionSchema>

interface Observacion extends ObservacionFormValues {
  id: string
  createdAt: string
}

interface ApiObservacion {
  id: number
  participante_id: number
  tarea_id: number
  exito: boolean | number
  tiempo_segundos: number
  cantidad_errores: number
  comentarios?: string
  problema_detectado?: string
  severidad?: 'baja' | 'media' | 'alta' | 'critica'
  mejora_propuesta?: string
  created_at?: string
}

interface ApiCreateObservacionResponse {
  id: number
  mensaje?: string
}

interface ApiParticipante {
  id: number
  nombre: string
}

interface ApiTarea {
  id: number
  escenario: string
}

interface OptionItem {
  value: string
  label: string
}

const SEVERIDAD_LABELS: Record<string, { label: string; class: string }> = {
  baja: { label: 'Baja', class: 'bg-info/15 text-info border-info/30' },
  media: { label: 'Media', class: 'bg-warning/15 text-warning-foreground border-warning/30' },
  alta: { label: 'Alta', class: 'bg-destructive/15 text-destructive border-destructive/30' },
  critica: { label: 'Crítica', class: 'bg-destructive/25 text-destructive border-destructive/50' },
}

const EMPTY_FORM: ObservacionFormValues = {
  participanteId: '',
  tareaId: '',
  exito: true,
  tiempoSegundos: 180,
  cantidadErrores: 0,
  comentarios: '',
  problemaDetectado: '',
  severidad: 'media',
  mejoraPropuesta: '',
}

function DetailModal({
  obs,
  isOpen,
  onClose,
  participantesOptions,
  tareasOptions,
}: {
  obs: Observacion | null
  isOpen: boolean
  onClose: () => void
  participantesOptions: OptionItem[]
  tareasOptions: OptionItem[]
}) {
  if (!isOpen || !obs) return null

  const estatus = obs.exito ? 'Exitoso' : obs.cantidadErrores > 2 ? 'Fallido' : 'Parcial'
  const tiempoMin = Math.floor(obs.tiempoSegundos / 60)
  const tiempoSeg = obs.tiempoSegundos % 60

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
          <h3 className="text-lg font-semibold">Detalles de Observación</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Participante</p>
              <p className="text-sm font-medium">{participantesOptions.find((p) => p.value === obs.participanteId)?.label || `Participante ${obs.participanteId}`}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Tarea</p>
              <p className="text-sm font-medium">{tareasOptions.find((t) => t.value === obs.tareaId)?.label || `Tarea ${obs.tareaId}`}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Tiempo</p>
              <p className="text-sm font-medium">{tiempoMin}m {tiempoSeg}s</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Errores</p>
              <p className="text-sm font-medium">{obs.cantidadErrores}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Estatus</p>
            <p className="text-sm font-medium">{estatus}</p>
          </div>
          {obs.comentarios && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Comentarios</p>
              <p className="text-sm">{obs.comentarios}</p>
            </div>
          )}
          {obs.problemaDetectado && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Problema Detectado</p>
              <p className="text-sm">{obs.problemaDetectado}</p>
            </div>
          )}
          {obs.severidad && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Severidad</p>
              <p className="text-sm">{SEVERIDAD_LABELS[obs.severidad]?.label}</p>
            </div>
          )}
          {obs.mejoraPropuesta && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Mejora Propuesta</p>
              <p className="text-sm">{obs.mejoraPropuesta}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ObservacionesView() {
  const [observaciones, setObservaciones] = useState<Observacion[]>([])
  const [participantesOptions, setParticipantesOptions] = useState<OptionItem[]>([])
  const [tareasOptions, setTareasOptions] = useState<OptionItem[]>([])
  const [isForm, setIsForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Observacion | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterParticipante, setFilterParticipante] = useState('')
  const [filterTarea, setFilterTarea] = useState('')
  const [detailObs, setDetailObs] = useState<Observacion | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { toasts, addToast, removeToast } = useToasts()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ObservacionFormValues>({
    resolver: zodResolver(observacionSchema),
    defaultValues: EMPTY_FORM,
  })

  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const toApiPayload = (data: ObservacionFormValues) => ({
    participante_id: Number(data.participanteId),
    tarea_id: Number(data.tareaId),
    exito: data.exito,
    tiempo_segundos: data.tiempoSegundos,
    cantidad_errores: data.cantidadErrores,
    comentarios: data.comentarios || '',
    problema_detectado: data.problemaDetectado || '',
    severidad: data.severidad || '',
    mejora_propuesta: data.mejoraPropuesta || '',
  })

  const getApiErrorMessage = async (response: Response) => {
    try {
      const errorBody = await response.json()
      if (Array.isArray(errorBody?.details) && errorBody.details.length > 0) {
        return errorBody.details.join(', ')
      }
      if (Array.isArray(errorBody?.detalles) && errorBody.detalles.length > 0) {
        return errorBody.detalles.join(', ')
      }
      return errorBody?.message || 'Error desconocido al procesar la solicitud'
    } catch {
      return 'No se pudo procesar la respuesta de error del backend'
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [obsResponse, participantesResponse, tareasResponse] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/observaciones`),
          fetch(`${getApiBaseUrl()}/api/participantes`),
          fetch(`${getApiBaseUrl()}/api/tareas`),
        ])

        if (!obsResponse.ok || !participantesResponse.ok || !tareasResponse.ok) {
          throw new Error('No se pudo obtener la lista de observaciones, participantes o tareas')
        }

        const [obsData, participantesData, tareasData] = await Promise.all([
          obsResponse.json() as Promise<ApiObservacion[]>,
          participantesResponse.json() as Promise<ApiParticipante[]>,
          tareasResponse.json() as Promise<ApiTarea[]>,
        ])

        const today = new Date().toISOString().split('T')[0]
        const mapped = obsData.map((item) => ({
          id: String(item.id),
          participanteId: String(item.participante_id),
          tareaId: String(item.tarea_id),
          exito: item.exito === true || item.exito === 1,
          tiempoSegundos: item.tiempo_segundos ?? 0,
          cantidadErrores: item.cantidad_errores ?? 0,
          comentarios: item.comentarios || '',
          problemaDetectado: item.problema_detectado || '',
          severidad: item.severidad || undefined,
          mejoraPropuesta: item.mejora_propuesta || '',
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : today,
        }))

        const mappedParticipantes = participantesData.map((item) => ({
          value: String(item.id),
          label: item.nombre,
        }))

        const mappedTareas = tareasData.map((item) => ({
          value: String(item.id),
          label: `T-${String(item.id).padStart(2, '0')} - ${item.escenario}`,
        }))

        setObservaciones(mapped)
        setParticipantesOptions(mappedParticipantes)
        setTareasOptions(mappedTareas)
      } catch (error) {
        console.error(error)
        addToast('error', 'No se pudieron cargar observaciones, participantes o tareas desde el backend')
      }
    }

    fetchData()
  }, [addToast])

  const getParticipanteLabel = (id: string) => {
    const participante = participantesOptions.find((item) => item.value === id)
    return participante?.label || `Participante ${id}`
  }

  const getTareaLabel = (id: string) => {
    const tarea = tareasOptions.find((item) => item.value === id)
    return tarea?.label || `Tarea ${id}`
  }

  const filteredObs = observaciones.filter((o) => {
    const matchSearch = searchQuery === '' || 
      o.comentarios?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.problemaDetectado?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchParticipante = filterParticipante === '' || o.participanteId === filterParticipante
    const matchTarea = filterTarea === '' || o.tareaId === filterTarea
    return matchSearch && matchParticipante && matchTarea
  })

  const onSubmit = async (data: ObservacionFormValues) => {
    if (editingId) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/observaciones/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiPayload(data)),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        setObservaciones((prev) => prev.map((o) => (o.id === editingId ? { ...o, ...data } : o)))
        addToast('success', 'Observación actualizada correctamente')
        setEditingId(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar la observación'
        addToast('error', 'No se pudo actualizar la observación', message)
        return
      }
    } else {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/observaciones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiPayload(data)),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        const created: ApiCreateObservacionResponse = await response.json()
        const newObs: Observacion = {
          ...data,
          id: String(created.id),
          createdAt: new Date().toISOString().split('T')[0],
        }

        setObservaciones((prev) => [...prev, newObs])
        addToast('success', 'Observación creada correctamente')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear la observación'
        addToast('error', 'No se pudo crear la observación', message)
        return
      }
    }
    setIsForm(false)
    reset()
  }

  const handleEdit = (obs: Observacion) => {
    setEditingId(obs.id)
    Object.keys(obs).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        setValue(key as keyof ObservacionFormValues, (obs as any)[key])
      }
    })
    setIsForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (obs: Observacion) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/observaciones/${obs.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const message = await getApiErrorMessage(response)
        throw new Error(message)
      }

      setObservaciones((prev) => prev.filter((o) => o.id !== obs.id))
      addToast('success', 'Observación eliminada correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la observación'
      addToast('error', 'No se pudo eliminar la observación', message)
    }
  }

  const handleViewDetails = (obs: Observacion) => {
    setDetailObs(obs)
    setDetailModalOpen(true)
    setOpenMenuId(null)
  }

  if (isForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setIsForm(false)
              reset()
              setEditingId(null)
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Volver"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">{editingId ? 'Editar Observación' : 'Crear Observación'}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Participante</label>
              <select
                {...register('participanteId')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Selecciona un participante</option>
                {participantesOptions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {errors.participanteId && <p className="text-destructive text-xs mt-1">{errors.participanteId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tarea</label>
              <select
                {...register('tareaId')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Selecciona una tarea</option>
                {tareasOptions.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.tareaId && <p className="text-destructive text-xs mt-1">{errors.tareaId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tiempo (segundos)</label>
              <input
                type="number"
                placeholder="180"
                {...register('tiempoSegundos', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.tiempoSegundos && <p className="text-destructive text-xs mt-1">{errors.tiempoSegundos.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad de Errores</label>
              <input
                type="number"
                placeholder="0"
                {...register('cantidadErrores', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.cantidadErrores && <p className="text-destructive text-xs mt-1">{errors.cantidadErrores.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">¿Exitoso?</label>
              <select
                {...register('exito', { setValueAs: (v) => v === 'true' })}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severidad</label>
              <select
                {...register('severidad')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Sin severidad</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comentarios</label>
            <textarea
              placeholder="Observaciones generales"
              {...register('comentarios')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Problema Detectado</label>
            <textarea
              placeholder="Describe el problema detectado"
              {...register('problemaDetectado')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mejora Propuesta</label>
            <textarea
              placeholder="Propuesta de mejora"
              {...register('mejoraPropuesta')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsForm(false)
                reset()
                setEditingId(null)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Registro de Observación</h2>
        <Button onClick={() => { setIsForm(true); reset(); setEditingId(null) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Observación
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por comentarios o problema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={filterParticipante}
            onChange={(e) => setFilterParticipante(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="">Todos los participantes</option>
            {participantesOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select
            value={filterTarea}
            onChange={(e) => setFilterTarea(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="">Todas las tareas</option>
            {tareasOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredObs.map((obs) => {
          const estatus = obs.exito ? 'Exitoso' : obs.cantidadErrores > 2 ? 'Fallido' : 'Parcial'
          const estatusColor = obs.exito ? 'bg-success/15 text-success' : obs.cantidadErrores > 2 ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning-foreground'
          const tiempoMin = Math.floor(obs.tiempoSegundos / 60)
          const tiempoSeg = obs.tiempoSegundos % 60

          return (
            <div key={obs.id} className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-card relative group">
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === obs.id ? null : obs.id)}
                  className="absolute -top-2 -right-2 p-2 hover:bg-secondary rounded-lg transition-colors z-10"
                  aria-label="Más opciones"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </button>

                {openMenuId === obs.id && (
                  <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => handleViewDetails(obs)}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </button>
                    <button
                      onClick={() => handleEdit(obs)}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm(obs)
                        setOpenMenuId(null)
                      }}
                      className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    {getParticipanteLabel(obs.participanteId)} - {getTareaLabel(obs.tareaId)}
                  </h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${estatusColor}`}>
                  {estatus}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo: <span className="font-medium text-foreground">{tiempoMin}m {tiempoSeg}s</span></span>
                  <span className="text-muted-foreground">Errores: <span className="font-medium text-foreground">{obs.cantidadErrores}</span></span>
                </div>
                {obs.severidad && (
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${SEVERIDAD_LABELS[obs.severidad]?.class}`}>
                      {SEVERIDAD_LABELS[obs.severidad]?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredObs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron observaciones</p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Eliminar observación</h3>
            <p className="text-sm text-muted-foreground mb-6">¿Estás seguro que deseas eliminar esta observación? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Eliminar
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DetailModal
        obs={detailObs}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        participantesOptions={participantesOptions}
        tareasOptions={tareasOptions}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
