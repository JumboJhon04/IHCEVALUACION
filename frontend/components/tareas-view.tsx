'use client'

import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ListChecks, Plus, Pencil, Trash2, Save, X, Search, Eye, MoreVertical, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastContainer } from '@/components/toast-container'
import { useToasts } from '@/hooks/use-toasts'

const tareaSchema = z.object({
  pruebaId: z.string().min(1, 'Selecciona una prueba'),
  escenario: z.string().min(5).max(500),
  resultadoEsperado: z.string().min(10).max(1000),
  metricaPrincipal: z.string().min(5).max(200),
  criterioExito: z.string().min(10).max(500),
})

type TareaFormValues = z.infer<typeof tareaSchema>

interface Tarea extends TareaFormValues {
  id: string
  createdAt: string
}

interface ApiTarea {
  id: number
  prueba_id: number
  escenario: string
  resultado_esperado: string
  metrica_principal: string
  criterio_exito: string
  created_at?: string
}

interface ApiCreateTareaResponse {
  id: number
  mensaje?: string
}

interface ApiPrueba {
  id: number
  producto: string
  modulo_evaluado: string
}

interface PruebaOption {
  value: string
  label: string
}

type SortFilter = 'recent' | 'oldest' | 'az'

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const EMPTY_FORM: TareaFormValues = {
  pruebaId: '',
  escenario: '',
  resultadoEsperado: '',
  metricaPrincipal: '',
  criterioExito: '',
}

function DetailModal({
  tarea,
  isOpen,
  onClose,
  pruebasOptions,
}: {
  tarea: Tarea | null
  isOpen: boolean
  onClose: () => void
  pruebasOptions: PruebaOption[]
}) {
  if (!isOpen || !tarea) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
          <h3 className="text-lg font-semibold">Detalles de Tarea</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Escenario</p>
            <p className="text-sm">{tarea.escenario}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Resultado Esperado</p>
            <p className="text-sm">{tarea.resultadoEsperado}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Métrica Principal</p>
            <p className="text-sm">{tarea.metricaPrincipal}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Criterio de Éxito</p>
            <p className="text-sm">{tarea.criterioExito}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Prueba</p>
            <p className="text-sm">{pruebasOptions.find((p) => p.value === tarea.pruebaId)?.label || `Prueba ${tarea.pruebaId}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TareasView() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [pruebasOptions, setPruebasOptions] = useState<PruebaOption[]>([])
  const [isForm, setIsForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Tarea | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedSort, setAppliedSort] = useState<SortFilter>('recent')
  const [draftSort, setDraftSort] = useState<SortFilter>('recent')
  const [appliedProof, setAppliedProof] = useState('all')
  const [draftProof, setDraftProof] = useState('all')
  const [detailTarea, setDetailTarea] = useState<Tarea | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { toasts, addToast, removeToast } = useToasts()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    const fetchTareasYPruebas = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const [responseTareas, responsePruebas] = await Promise.all([
          fetch(`${baseUrl}/api/tareas`),
          fetch(`${baseUrl}/api/pruebas`),
        ])

        if (!responseTareas.ok || !responsePruebas.ok) {
          throw new Error('No se pudo obtener la lista de tareas y pruebas')
        }

        const [dataTareas, dataPruebas] = await Promise.all([
          responseTareas.json() as Promise<ApiTarea[]>,
          responsePruebas.json() as Promise<ApiPrueba[]>,
        ])

        const mapped = dataTareas.map((item) => ({
          id: String(item.id),
          pruebaId: String(item.prueba_id),
          escenario: item.escenario,
          resultadoEsperado: item.resultado_esperado,
          metricaPrincipal: item.metrica_principal,
          criterioExito: item.criterio_exito,
          createdAt: item.created_at
            ? new Date(item.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        }))

        const mappedPruebas = dataPruebas.map((item) => ({
          value: String(item.id),
          label: `${item.producto} - ${item.modulo_evaluado}`,
        }))

        setTareas(mapped)
        setPruebasOptions(mappedPruebas)
      } catch (error) {
        console.error(error)
        addToast('error', 'No se pudieron cargar las tareas o pruebas desde el backend')
      }
    }

    fetchTareasYPruebas()
  }, [addToast])

  const filteredTareas = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery)
    const queryTokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/).filter(Boolean) : []

    const bySearch = tareas.filter((t) => {
      if (appliedProof !== 'all' && t.pruebaId !== appliedProof) return false

      if (queryTokens.length === 0) return true

      const searchable = normalizeText(
        [t.escenario, t.metricaPrincipal, t.criterioExito].filter(Boolean).join(' ')
      )

      return queryTokens.every((token) => searchable.includes(token))
    })

    return bySearch.sort((a, b) => {
      if (appliedSort === 'az') {
        return a.escenario.localeCompare(b.escenario, 'es', { sensitivity: 'base' })
      }
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return appliedSort === 'oldest' ? dateA - dateB : dateB - dateA
    })
  }, [tareas, searchQuery, appliedSort, appliedProof])

  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const toApiPayload = (data: TareaFormValues) => ({
    prueba_id: Number(data.pruebaId),
    escenario: data.escenario,
    resultado_esperado: data.resultadoEsperado,
    metrica_principal: data.metricaPrincipal,
    criterio_exito: data.criterioExito,
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

  const onSubmit = async (data: TareaFormValues) => {
    if (editingId) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/tareas/${editingId}`, {
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

        setTareas((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...data } : t)))
        addToast('success', 'Tarea actualizada correctamente')
        setEditingId(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar la tarea'
        addToast('error', 'No se pudo actualizar la tarea', message)
        return
      }
    } else {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/tareas`, {
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

        const created: ApiCreateTareaResponse = await response.json()
        const newTarea: Tarea = {
          ...data,
          id: String(created.id),
          createdAt: new Date().toISOString().split('T')[0],
        }

        setTareas((prev) => [...prev, newTarea])
        addToast('success', 'Tarea creada correctamente')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear la tarea'
        addToast('error', 'No se pudo crear la tarea', message)
        return
      }
    }

    setIsForm(false)
    reset()
  }

  const handleEdit = (tarea: Tarea) => {
    setEditingId(tarea.id)
    Object.keys(tarea).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        setValue(key as keyof TareaFormValues, (tarea as any)[key])
      }
    })
    setIsForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (tarea: Tarea) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/tareas/${tarea.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const message = await getApiErrorMessage(response)
        throw new Error(message)
      }

      setTareas((prev) => prev.filter((t) => t.id !== tarea.id))
      addToast('success', 'Tarea eliminada correctamente')
      setDeleteConfirm(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la tarea'
      addToast('error', 'No se pudo eliminar la tarea', message)
    }
  }

  const handleViewDetails = (tarea: Tarea) => {
    setDetailTarea(tarea)
    setDetailModalOpen(true)
    setOpenMenuId(null)
  }

  const activeFilterCount =
    (appliedSort !== 'recent' ? 1 : 0) +
    (appliedProof !== 'all' ? 1 : 0)

  const syncDraftWithApplied = () => {
    setDraftSort(appliedSort)
    setDraftProof(appliedProof)
  }

  const applyFilters = () => {
    setAppliedSort(draftSort)
    setAppliedProof(draftProof)
    setFilterOpen(false)
  }

  const clearAllFilters = () => {
    setAppliedSort('recent')
    setDraftSort('recent')
    setAppliedProof('all')
    setDraftProof('all')
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
          <h2 className="text-2xl font-bold">{editingId ? 'Editar Tarea' : 'Crear Tarea'}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-1">Prueba</label>
            <select
              {...register('pruebaId')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">Selecciona una prueba</option>
              {pruebasOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.pruebaId && <p className="text-destructive text-xs mt-1">{errors.pruebaId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Escenario</label>
            <textarea
              placeholder="Describe el escenario de la tarea"
              {...register('escenario')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
            />
            {errors.escenario && <p className="text-destructive text-xs mt-1">{errors.escenario.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Resultado Esperado</label>
            <textarea
              placeholder="¿Cuál es el resultado esperado?"
              {...register('resultadoEsperado')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
            />
            {errors.resultadoEsperado && <p className="text-destructive text-xs mt-1">{errors.resultadoEsperado.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Métrica Principal</label>
            <input
              type="text"
              placeholder="Ej: Tiempo en completar, Número de clics"
              {...register('metricaPrincipal')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.metricaPrincipal && <p className="text-destructive text-xs mt-1">{errors.metricaPrincipal.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Criterio de Éxito</label>
            <textarea
              placeholder="Define el criterio de éxito"
              {...register('criterioExito')}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
            />
            {errors.criterioExito && <p className="text-destructive text-xs mt-1">{errors.criterioExito.message}</p>}
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
        <h2 className="text-2xl font-bold">Gestión de Tareas y Guion</h2>
        <Button onClick={() => { setIsForm(true); reset(); setEditingId(null) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Tarea
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por escenario, métrica, criterio..."
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
          {filteredTareas.length} resultado{filteredTareas.length === 1 ? '' : 's'} encontrados
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
                <label className="mb-2 block text-sm font-medium">Prueba</label>
                <div className="relative">
                  <select
                    value={draftProof}
                    onChange={(e) => setDraftProof(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="all">Todas las pruebas</option>
                    {pruebasOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
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
                    <option value="az">Escenario A-Z</option>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTareas.map((tarea) => (
          <div key={tarea.id} className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-card relative group">
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(openMenuId === tarea.id ? null : tarea.id)}
                className="absolute -top-2 -right-2 p-2 hover:bg-secondary rounded-lg transition-colors z-10"
                aria-label="Más opciones"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              </button>

              {openMenuId === tarea.id && (
                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => handleViewDetails(tarea)}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleEdit(tarea)}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 border-b border-border"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(tarea)
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

            <h3 className="font-semibold text-sm line-clamp-2 mb-3">{tarea.escenario}</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Métrica:</span> {tarea.metricaPrincipal}</p>
              </div>
              <div>
                <p className="text-muted-foreground line-clamp-1"><span className="font-medium text-foreground">Criterio:</span> {tarea.criterioExito}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTareas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron tareas</p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Eliminar tarea</h3>
            <p className="text-sm text-muted-foreground mb-6">¿Estás seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer.</p>
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
        tarea={detailTarea}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        pruebasOptions={pruebasOptions}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
