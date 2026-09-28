import { useState } from 'react'
import Layout from '../../../shared/components/Layout'
import CotizacionesTable from '../components/CotizacionesTable'
import CotizacionForm from '../components/CotizacionForm'
import { useCotizaciones, useCrearCotizacion, useActualizarCotizacion, useEliminarCotizacion } from '../hooks/useCotizaciones'
import { useProveedores } from '../hooks/useProveedores'
import { useProyectos } from '../../proyectos/hooks/useProyectos'
import type { Cotizacion } from '../types'

export default function CotizacionesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCotizacion, setEditingCotizacion] = useState<Cotizacion | undefined>()

  const { data: cotizaciones, isLoading, error } = useCotizaciones()
  const { data: proveedores } = useProveedores()
  const { data: proyectos } = useProyectos()
  const crearMutation = useCrearCotizacion()
  const actualizarMutation = useActualizarCotizacion()
  const eliminarMutation = useEliminarCotizacion()

  const handleOpenForm = (cotizacion?: Cotizacion) => {
    setEditingCotizacion(cotizacion)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCotizacion(undefined)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingCotizacion) {
        await actualizarMutation.mutateAsync({ ...data, id: editingCotizacion.id })
      } else {
        await crearMutation.mutateAsync(data)
      }
      handleCloseForm()
    } catch (err) {
      console.error('Error:', err)
      alert('Hubo un error. Intenta de nuevo.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync(id)
    } catch (err) {
      console.error('Error:', err)
      alert('No se pudo eliminar la cotización')
    }
  }

  const contarPorEstado = (estado: string) => cotizaciones?.filter(c => c.estado === estado).length || 0

  return (
    <Layout title="Cotizaciones">
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Total cotizaciones</div>
            <div className="text-2xl font-bold text-slate-900">{cotizaciones?.length || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Borradores</div>
            <div className="text-2xl font-bold text-slate-600">{contarPorEstado('borrador')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Enviadas</div>
            <div className="text-2xl font-bold text-blue-600">{contarPorEstado('enviada')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Aceptadas</div>
            <div className="text-2xl font-bold text-green-600">{contarPorEstado('aceptada')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Rechazadas</div>
            <div className="text-2xl font-bold text-red-600">{contarPorEstado('rechazada')}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <i className="ti ti-plus text-base" />
            Nueva cotización
          </button>
          <input
            type="text"
            placeholder="Buscar por número o proveedor..."
            className="flex-1 max-w-sm px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-600">
              <p>Error al cargar cotizaciones: {error.message}</p>
            </div>
          ) : (
            <CotizacionesTable
              cotizaciones={cotizaciones || []}
              proveedores={proveedores || []}
              proyectos={proyectos || []}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Modal con formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingCotizacion ? 'Editar cotización' : 'Nueva cotización'}
                </h2>
              </div>
              <div className="p-6">
                <CotizacionForm
                  cotizacion={editingCotizacion}
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