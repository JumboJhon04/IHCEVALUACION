'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Users, Plus, Pencil, Trash2, Save, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToastContainer } from '@/components/toast-container'
import { useToasts } from '@/hooks/use-toasts'
import { cn } from '@/lib/utils'

const participanteSchema = z.object({
  nombre: z.string().min(2).max(100),
  perfil: z.string().min(2).max(100),
})

type ParticipanteFormValues = z.infer<typeof participanteSchema>

interface Participante extends ParticipanteFormValues {
  id: string
  createdAt: string
}

interface ApiParticipante {
  id: number
  nombre: string
  perfil: string
  created_at?: string
}

interface ApiCreateParticipanteResponse {
  id: number
  mensaje?: string
}

const EMPTY_FORM: ParticipanteFormValues = {
  nombre: '',
  perfil: '',
}

export function ParticipantesView() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [isForm, setIsForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Participante | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPerfil, setFilterPerfil] = useState('')
  const { toasts, addToast, removeToast } = useToasts()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ParticipanteFormValues>({
    resolver: zodResolver(participanteSchema),
    defaultValues: EMPTY_FORM,
  })

  const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
    const fetchParticipantes = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/participantes`)

        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de participantes')
        }

        const data: ApiParticipante[] = await response.json()
        const mapped = data.map((item) => ({
          id: String(item.id),
          nombre: item.nombre,
          perfil: item.perfil,
          createdAt: item.created_at
            ? new Date(item.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        }))

        setParticipantes(mapped)
      } catch (error) {
        console.error(error)
        addToast('error', 'No se pudieron cargar los participantes desde el backend')
      }
    }

    fetchParticipantes()
  }, [addToast])

  // Extract unique profiles for dropdown
  const uniqueProfiles = useMemo(() => {
    const profiles = [...new Set(participantes.map(p => p.perfil))]
    return profiles.sort()
  }, [participantes])

  // Filter participantes based on search and profile
  const filteredParticipantes = useMemo(() => {
    return participantes.filter((p) => {
      const matchesSearch = searchQuery === '' || 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.perfil.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPerfil = filterPerfil === '' || p.perfil === filterPerfil
      return matchesSearch && matchesPerfil
    })
  }, [participantes, searchQuery, filterPerfil])

  const onSubmit = async (data: ParticipanteFormValues) => {
    if (editingId) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/participantes/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        setParticipantes((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...data } : p)))
        addToast('success', 'Participante actualizado')
        setEditingId(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo actualizar el participante'
        addToast('error', 'No se pudo actualizar el participante', message)
        return
      }
    } else {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/participantes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        const created: ApiCreateParticipanteResponse = await response.json()
        const newParticipante: Participante = {
          ...data,
          id: String(created.id),
          createdAt: new Date().toISOString().split('T')[0],
        }

        setParticipantes((prev) => [...prev, newParticipante])
        addToast('success', 'Participante creado')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo crear el participante'
        addToast('error', 'No se pudo crear el participante', message)
        return
      }
    }

    setIsForm(false)
    reset(EMPTY_FORM)
  }

  const handleEdit = (participante: Participante) => {
    reset({
      nombre: participante.nombre,
      perfil: participante.perfil,
    })
    setEditingId(participante.id)
    setIsForm(true)
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/participantes/${deleteConfirm.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const message = await getApiErrorMessage(response)
          throw new Error(message)
        }

        setParticipantes((prev) => prev.filter((p) => p.id !== deleteConfirm.id))
        addToast('success', 'Participante eliminado')
        setDeleteConfirm(null)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo eliminar el participante'
        addToast('error', 'No se pudo eliminar el participante', message)
      }
    }
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {isForm ? (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              {editingId ? 'Editar Participante' : 'Nuevo Participante'}
            </h2>
            <button
              onClick={() => {
                setIsForm(false)
                setEditingId(null)
                reset(EMPTY_FORM)
              }}
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              aria-label="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Nombre del participante"
                  {...register('nombre')}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary',
                    errors.nombre ? 'border-destructive' : 'border-input'
                  )}
                />
                {errors.nombre && <p className="text-destructive text-xs mt-1">{errors.nombre.message}</p>}
              </div>

              {/* Perfil */}
              <div>
                <label htmlFor="perfil" className="block text-sm font-medium mb-1">
                  Perfil <span className="text-destructive">*</span>
                </label>
                <input
                  id="perfil"
                  type="text"
                  placeholder="Descripción del perfil del participante"
                  {...register('perfil')}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary',
                    errors.perfil ? 'border-destructive' : 'border-input'
                  )}
                />
                {errors.perfil && <p className="text-destructive text-xs mt-1">{errors.perfil.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsForm(false)
                  setEditingId(null)
                  reset(EMPTY_FORM)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Participantes
            </h2>
            <Button onClick={() => setIsForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Participante
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search by Name */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                aria-label="Buscar participantes por nombre"
              />
            </div>

            {/* Filter by Profile */}
            <select
              value={filterPerfil}
              onChange={(e) => setFilterPerfil(e.target.value)}
              className="px-4 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background min-w-[200px]"
              aria-label="Filtrar por perfil"
            >
              <option value="">Todos los perfiles</option>
              {uniqueProfiles.map((perfil) => (
                <option key={perfil} value={perfil}>
                  {perfil}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {filteredParticipantes.length} de {participantes.length} participantes
          </p>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-max">
                <thead className="border-b border-border bg-secondary/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold">Perfil</th>
                    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipantes.length > 0 ? (
                    filteredParticipantes.map((participante) => (
                      <tr key={participante.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-xs">{participante.id}</td>
                        <td className="px-4 py-3 font-medium">{participante.nombre}</td>
                        <td className="px-4 py-3 text-xs">{participante.perfil}</td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(participante)}
                            className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                            title="Editar"
                            aria-label={`Editar participante ${participante.id}`}
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(participante)}
                            className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
                            title="Eliminar"
                            aria-label={`Eliminar participante ${participante.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No se encontraron participantes con los filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-muted-foreground mb-6">¿Estás seguro de que deseas eliminar este participante?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
