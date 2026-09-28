import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../../../shared/components/Layout'
import HitosTable from '../components/HitosTable'
import HitoForm from '../components/HitoForm'
import { useHitos, useCrearHito, useActualizarHito, useEliminarHito } from '../hooks/useHitos'
import { useProyectos } from '../hooks/useProyectos'
import type { Hito } from '../types'

export default function HitosPage() {
  const [searchParams] = useSearchParams()
  const proyectoId = searchParams.get('proyecto_id')

  const [showForm, setShowForm] = useState(false)
  const [editingHito, setEditingHito] = useState<Hito | undefined>()

  const { data: proyectos } = useProyectos()
  const { data: hitos, isLoading, error } = useHitos(proyectoId || '')
  const crearMutation = useCrearHito()
  const actualizarMutation = useActualizarHito()
  const eliminarMutation = useEliminarHito()

  const proyectoActual = proyectos?.find(p => p.id === proyectoId)

  const handleOpenForm = (hito?: Hito) => {
    setEditingHito(hito)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingHito(undefined)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingHito) {
        await actualizarMutation.mutateAsync({ ...data, id: editingHito.id, proyecto_id: proyectoId })
      } else {
        await crearMutation.mutateAsync({ ...data, proyecto_id: proyectoId })
      }
      handleCloseForm()
    } catch (err) {
      console.error('Error:', err)
      alert('Hubo un error. Intenta de nuevo.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync({ id, proyecto_id: proyectoId } as any)
    } catch (err) {
      console.error('Error:', err)
      alert('No se pudo eliminar el hito')
    }
  }

  if (!proyectoId) {
    return (
      <Layout title="Hitos">
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">Selecciona un proyecto para ver sus hitos</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`Hitos - ${proyectoActual?.nombre || 'Proyecto'}`}>
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Total hitos</div>
            <div className="text-2xl font-bold text-slate-900">{hitos?.length || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Pendientes</div>
            <div className="text-2xl font-bold text-slate-500">
              {hitos?.filter(h => h.estado === 'pendiente').length || 0}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">En progreso</div>
            <div className="text-2xl font-bold text-blue-600">
              {hitos?.filter(h => h.estado === 'en_progreso').length || 0}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Completados</div>
            <div className="text-2xl font-bold text-green-600">
              {hitos?.filter(h => h.estado === 'completado').length || 0}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <i className="ti ti-plus text-base" />
            Nuevo hito
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-600">
              <p>Error al cargar hitos: {error.message}</p>
            </div>
          ) : (
            <HitosTable
              hitos={hitos || []}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Modal con formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingHito ? 'Editar hito' : 'Nuevo hito'}
                </h2>
              </div>
              <div className="p-6">
                <HitoForm
                  hito={editingHito}
                  onSubmit={handleSubmit}
                  onClose={handleCloseForm}
                  isLoading={crearMutation.isPending || actualizarMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}