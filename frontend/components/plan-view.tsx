'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Search, Eye, MoreVertical, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastContainer } from '@/components/toast-container'
import { useToasts } from '@/hooks/use-toasts'

const planSchema = z.object({
  producto: z.string().min(2).max(100),
  moduloEvaluado: z.string().min(2).max(100),
  objetivo: z.string().min(10).max(5000),
  perfilUsuarios: z.string().min(5).max(255),
  metodo: z.string().min(1).max(100),
  fecha: z.string().min(1),
  lugar: z.string().min(3).max(100),
  duracionMinutos: z.number().min(5).max(480),
  instruccionesInicio: z.string().max(5000).optional(),
  preguntasSeguimiento: z.string().max(5000).optional(),
  instruccionesCierre: z.string().max(5000).optional(),
})

type PlanFormValues = z.infer<typeof planSchema>

interface Plan extends PlanFormValues {
  id: string
  createdAt: string
}

interface ApiPrueba {
  id: number
  producto: string
  modulo_evaluado: string
  objetivo: string
  perfil_usuarios?: string | null
  metodo?: string | null
  fecha?: string | null
  lugar?: string | null
  duracion_minutos?: number | null
  instrucciones_inicio?: string | null
  preguntas_seguimiento?: string | null
  instrucciones_cierre?: string | null
  created_at?: string
}

interface ApiCreatePruebaResponse {
  id: number
  mensaje?: string
}

const METODOS = [
  'Prueba moderada presencial',
  'Prueba moderada remota',
  'Prueba no moderada remota',
  'Entrevista contextual',
  'Think-Aloud',
  'A/B Testing',
]

const EMPTY_FORM: PlanFormValues = {
  producto: '',
  moduloEvaluado: '',
  objetivo: '',
  perfilUsuarios: '',
  metodo: '',
  fecha: '',
  lugar: '',
  duracionMinutos: 30,
  instruccionesInicio: '',
  preguntasSeguimiento: '',
  instruccionesCierre: '',
}

type DateFilter = 'all' | 'upcoming' | 'past' | 'thisMonth'
type DurationFilter = 'all' | 'short' | 'medium' | 'long'
type SortFilter = 'recent' | 'oldest' | 'az'

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime())

function DetailModal({ plan, isOpen, onClose }: { plan: Plan | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !plan) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
          <h3 className="text-lg font-semibold">{plan.producto}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Módulo</p>
              <p className="text-sm font-medium">{plan.moduloEvaluado}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Método</p>
              <p className="text-sm font-medium">{plan.metodo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Fecha</p>
              <p className="text-sm font-medium">{plan.fecha}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase">Duración</p>
              <p className="text-sm font-medium">{plan.duracionMinutos} minutos</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Objetivo</p>
            <p className="text-sm">{plan.objetivo}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Perfil de Usuarios</p>
            <p className="text-sm">{plan.perfilUsuarios}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Lugar</p>
            <p className="text-sm">{plan.lugar}</p>
          </div>
          {plan.instruccionesInicio && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Instrucciones Inicio</p>
              <p className="text-sm">{plan.instruccionesInicio}</p>
            </div>
          )}
          {plan.preguntasSeguimiento && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Preguntas Seguimiento</p>
              <p className="text-sm">{plan.preguntasSeguimiento}</p>
            </div>
          )}
          {plan.instruccionesCierre && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Instrucciones Cierre</p>
              <p className="text-sm">{plan.instruccionesCierre}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PlanView() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isForm, setIsForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Plan | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedMethod, setAppliedMethod] = useState('all')
  const [appliedDate, setAppliedDate] = useState<DateFilter>('all')
  const [appliedDuration, setAppliedDuration] = useState<DurationFilter>('all')
  const [appliedSort, setAppliedSort] = useState<SortFilter>('recent')
  const [draftMethod, setDraftMethod] = useState('all')
  const [draftDate, setDraftDate] = useState<DateFilter>('all')
  const [draftDuration, setDraftDuration] = useState<DurationFilter>('all')
  const [draftSort, setDraftSort] = useState<SortFilter>('recent')
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { toasts, addToast, removeToast } = useToasts()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: EMPTY_FORM,
  })

  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const toDateOnly = (value?: string | null) => {
    if (!value) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ''

    return parsed.toISOString().split('T')[0]
  }

  const toApiPayload = (data: PlanFormValues) => ({
    producto: data.producto,
    modulo_evaluado: data.moduloEvaluado,
    objetivo: data.objetivo,
    perfil_usuarios: data.perfilUsuarios,
    metodo: data.metodo,
    fecha: data.fecha,
    lugar: data.lugar,
    duracion_minutos: data.duracionMinutos,
    instrucciones_inicio: data.instruccionesInicio || null,
    preguntas_seguimiento: data.preguntasSeguimiento || null,
    instrucciones_cierre: data.instruccionesCierre || null,
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
    const fetchPlanes = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/pruebas`)

        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de planes')
        }

        const data: ApiPrueba[] = await response.json()
        const today = new Date().toISOString().split('T')[0]
        const mapped = data.map((item) => ({
          id: String(item.id),
          producto: item.producto,
          moduloEvaluado: item.modulo_evaluado,
          objetivo: item.objetivo,
          perfilUsuarios: item.perfil_usuarios ?? '',
          metodo: item.metodo ?? '',
          fecha: toDateOnly(item.fecha),
          lugar: item.lugar ?? '',
          duracionMinutos: item.duracion_minutos ?? 30,
          instruccionesInicio: item.instrucciones_inicio ?? '',
          preguntasSeguimiento: item.preguntas_seguimiento ?? '',
          instruccionesCierre: item.instrucciones_cierre ?? '',
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : today,
        }))

        setPlans(mapped)
      } catch (error) {
        console.error(error)
        addToast('error', 'No se pudieron cargar los planes desde el backend')
      }
    }

    fetchPlanes()
  }, [addToast])

  const filteredPlans = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery)
    const queryTokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/).filter(Boolean) : []

    const today = new Date()
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const byFilters = plans.filter((plan) => {
      if (appliedMethod !== 'all' && plan.metodo !== appliedMethod) return false

      const planDate = plan.fecha && isValidDate(plan.fecha) ? new Date(`${plan.fecha}T00:00:00`) : null

      const matchesDate =
        appliedDate === 'all' ||
        (appliedDate === 'upcoming' && !!planDate && planDate >= startToday) ||
        (appliedDate === 'past' && !!planDate && planDate < startToday) ||
        (appliedDate === 'thisMonth' && !!planDate && planDate >= startMonth && planDate <= endMonth)

      if (!matchesDate) return false

      const matchesDuration =
        appliedDuration === 'all' ||
        (appliedDuration === 'short' && plan.duracionMinutos <= 30) ||
        (appliedDuration === 'medium' && plan.duracionMinutos > 30 && plan.duracionMinutos <= 60) ||
        (appliedDuration === 'long' && plan.duracionMinutos > 60)

      if (!matchesDuration) return false

      if (queryTokens.length === 0) return true

      const searchable = normalizeText(
        [
          plan.producto,
          plan.moduloEvaluado,
          plan.objetivo,
          plan.perfilUsuarios,
          plan.metodo,
          plan.lugar,
          plan.fecha,
          String(plan.duracionMinutos),
        ]
          .filter(Boolean)
          .join(' ')
      )

      return queryTokens.every((token) => searchable.includes(token))
    })

    return byFilters.sort((a, b) => {
      if (appliedSort === 'az') {
        return a.producto.localeCompare(b.producto, 'es', { sensitivity: 'base' })
      }
      const dateA = a.fecha && isValidDate(a.fecha) ? new Date(`${a.fecha}T00:00:00`).getTime() : 0
      const dateB = b.fecha && isValidDate(b.fecha) ? new Date(`${b.fecha}T00:00:00`).getTime() : 0
      return appliedSort === 'oldest' ? dateA - dateB : dateB - dateA
    })
  }, [plans, searchQuery, appliedMethod, appliedDate, appliedDuration, appliedSort])

  const activeFilterCount =
    (appliedMethod !== 'all' ? 1 : 0) +
    (appliedSort !== 'recent' ? 1 : 0)

  const syncDraftWithApplied = () => {
    setDraftMethod(appliedMethod)
    setDraftDate(appliedDate)
    setDraftDuration(appliedDuration)
    setDraftSort(appliedSort)
  }

  const applyFilters = () => {
    setAppliedMethod(draftMethod)
    setAppliedDate(draftDate)
    setAppliedDuration(draftDuration)
    setAppliedSort(draftSort)
    setFilterOpen(false)
  }

  const clearAllFilters = () => {
    setAppliedMethod('all')
    setAppliedDate('all')
    setAppliedDuration('all')
    setAppliedSort('recent')
    setDraftMethod('all')
    setDraftDate('all')
    setDraftDuration('all')
    setDraftSort('recent')
  }

  const onSubmit = async (data: PlanFormValues) => {
    if (editingId) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/pruebas/${editingId}`, {
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

        setPlans((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...data } : p)))
        addToast('success', 'Plan actualizado correctamente')
        setEditingId(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar el plan'
        addToast('error', 'No se pudo actualizar el plan', message)
        return
      }
    } else {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/pruebas`, {
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

        const created: ApiCreatePruebaResponse = await response.json()
        const newPlan: Plan = {
          ...data,
          id: String(created.id),
          createdAt: new Date().toISOString().split('T')[0],
        }

        setPlans((prev) => [...prev, newPlan])
        addToast('success', 'Plan creado correctamente')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear el plan'
        addToast('error', 'No se pudo crear el plan', message)
        return
      }
    }
    setIsForm(false)
    reset()
  }

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id)
    Object.keys(plan).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        setValue(key as keyof PlanFormValues, (plan as any)[key])
      }
    })
    setIsForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (plan: Plan) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/pruebas/${plan.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const message = await getApiErrorMessage(response)
        throw new Error(message)
      }

      setPlans((prev) => prev.filter((p) => p.id !== plan.id))
      addToast('success', 'Plan eliminado correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el plan'
      addToast('error', 'No se pudo eliminar el plan', message)
    }
  }

  const handleViewDetails = (plan: Plan) => {
    setDetailPlan(plan)
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
          <h2 className="text-2xl font-bold">{editingId ? 'Editar Plan' : 'Crear Plan de Prueba'}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
          {/* Fila 1: Producto, Módulo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Producto</label>
              <input
                type="text"
                placeholder="Nombre del producto"
                {...register('producto')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.producto && <p className="text-destructive text-xs mt-1">{errors.producto.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Módulo Evaluado</label>
              <input
                type="text"
                placeholder="Ej: Checkout, Onboarding"
                {...register('moduloEvaluado')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.moduloEvaluado && <p className="text-destructive text-xs mt-1">{errors.moduloEvaluado.message}</p>}
            </div>
          </div>

          {/* Fila 2: Perfil, Lugar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Perfil de Usuarios</label>
              <input
                type="text"
                placeholder="Características del perfil"
                {...register('perfilUsuarios')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.perfilUsuarios && <p className="text-destructive text-xs mt-1">{errors.perfilUsuarios.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lugar</label>
              <input
                type="text"
                placeholder="Ubicación física o remota"
                {...register('lugar')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.lugar && <p className="text-destructive text-xs mt-1">{errors.lugar.message}</p>}
            </div>
          </div>

          {/* Fila 3: Método, Fecha, Duración */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Método</label>
              <select
                {...register('metodo')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              >
                <option value="">Selecciona un método</option>
                {METODOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.metodo && <p className="text-destructive text-xs mt-1">{errors.metodo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                {...register('fecha')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.fecha && <p className="text-destructive text-xs mt-1">{errors.fecha.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duración (min)</label>
              <input
                type="number"
                placeholder="45"
                {...register('duracionMinutos', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.duracionMinutos && <p className="text-destructive text-xs mt-1">{errors.duracionMinutos.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Objetivo</label>
              <textarea
                placeholder="Describe el objetivo principal"
                {...register('objetivo')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
              {errors.objetivo && <p className="text-destructive text-xs mt-1">{errors.objetivo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instrucciones de Inicio</label>
              <textarea
                placeholder="Instrucciones para el inicio"
                {...register('instruccionesInicio')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preguntas de Seguimiento</label>
              <textarea
                placeholder="Preguntas a realizar"
                {...register('preguntasSeguimiento')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instrucciones de Cierre</label>
              <textarea
                placeholder="Instrucciones para cerrar"
                {...register('instruccionesCierre')}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-16"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsForm(false)
                reset()
                setEditingId(null)
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión del Plan de Prueba</h2>
        <Button onClick={() => { setIsForm(true); reset(); setEditingId(null) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Plan
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por producto, módulo, método, lugar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl border-primary/40"
            onClick={() => {
              syncDraftWithApplied()
              setFilterOpen(true)
            }}
          >
            <Filter className="h-4 w-4" />
            Filtro
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredPlans.length} resultado{filteredPlans.length === 1 ? '' : 's'} encontrados
        </p>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-2xl font-semibold tracking-tight">Filtro</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Cerrar filtros"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Método</label>
                <div className="relative">
                  <select
                    value={draftMethod}
                    onChange={(e) => setDraftMethod(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="all">Todos los métodos</option>
                    {METODOS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Orden</label>
                <div className="relative">
                  <select
                    value={draftSort}
                    onChange={(e) => setDraftSort(e.target.value as SortFilter)}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="az">Producto A-Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border p-5 gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={clearAllFilters}>
                Reiniciar
              </Button>
              <Button type="button" className="flex-1" onClick={applyFilters}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-card relative group">
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === plan.id ? null : plan.id)}
                className="absolute -top-2 -right-2 p-2 hover:bg-secondary rounded-lg transition-colors z-10"
                aria-label="Más opciones"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>

              {openMenuId === plan.id && (
                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => handleViewDetails(plan)}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleEdit(plan)}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(plan)
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

            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{plan.producto}</h3>
            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{plan.moduloEvaluado}</span>
              </p>
              <p className="text-muted-foreground line-clamp-2">{plan.objetivo}</p>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">{plan.fecha}</span>
                <span className="font-medium">{plan.duracionMinutos} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron planes</p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Eliminar plan</h3>
            <p className="text-sm text-muted-foreground mb-6">¿Estás seguro que deseas eliminar este plan? Esta acción no se puede deshacer.</p>
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

      <DetailModal plan={detailPlan} isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
