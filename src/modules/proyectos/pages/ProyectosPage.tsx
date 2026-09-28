import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../../shared/components/Layout'
import ProyectosTable from '../components/ProyectosTable'
import ProyectoForm from '../components/ProyectoForm'
import { useProyectos, useCrearProyecto, useActualizarProyecto, useEliminarProyecto } from '../hooks/useProyectos'
import { useClientes } from '../../ventas/hooks/useClientes'
import type { Proyecto } from '../types'

export default function ProyectosPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipoFiltro = searchParams.get('tipo')

  const [showForm, setShowForm] = useState(false)
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | undefined>()

  const { data: proyectos, isLoading, error } = useProyectos()
  const { data: clientes } = useClientes()
  const crearMutation = useCrearProyecto()
  const actualizarMutation = useActualizarProyecto()
  const eliminarMutation = useEliminarProyecto()

  const handleOpenForm = (proyecto?: Proyecto) => {
    setEditingProyecto(proyecto)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProyecto(undefined)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingProyecto) {
        await actualizarMutation.mutateAsync({ ...data, id: editingProyecto.id })
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
      alert('No se pudo eliminar el proyecto')
    }
  }

  const handleViewHitos = (proyectoId: string) => {
    navigate(`/proyectos/hitos?proyecto_id=${proyectoId}`)
  }

  const handleViewGantt = (proyectoId: string) => {
    navigate(`/proyectos/gantt?proyecto_id=${proyectoId}`)
  }

  // Filtrar por tipo si viene en URL
  const proyectosFiltrados = tipoFiltro
    ? proyectos?.filter(p => p.tipo_proyecto === tipoFiltro)
    : proyectos

  // Contar proyectos por estado (usa los filtrados)
  const contarPorEstado = (estado: string) => proyectosFiltrados?.filter(p => p.estado === estado).length || 0

  return (
    <Layout title="Proyectos">
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Total proyectos</div>
            <div className="text-2xl font-bold text-slate-900">{proyectosFiltrados?.length || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Activos</div>
            <div className="text-2xl font-bold text-blue-600">{contarPorEstado('activo')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Pausados</div>
            <div className="text-2xl font-bold text-yellow-600">{contarPorEstado('pausado')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Terminados</div>
            <div className="text-2xl font-bold text-green-600">{contarPorEstado('terminado')}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Presupuesto total</div>
            <div className="text-lg font-bold text-slate-900">
              {proyectosFiltrados && proyectosFiltrados.length > 0
                ? (proyectosFiltrados.reduce((sum, p) => sum + p.presupuesto_uf, 0)).toLocaleString('es-CL', { maximumFractionDigits: 0 })
                : '0'
              } UF
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
            Nuevo proyecto
          </button>
          <input
            type="text"
            placeholder="Buscar por nombre o cliente..."
            className="flex-1 max-w-sm px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-600">
              <p>Error al cargar proyectos: {error.message}</p>
            </div>
          ) : (
            <ProyectosTable
              proyectos={proyectosFiltrados || []}
              clientes={clientes || []}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onViewHitos={handleViewHitos}
              onViewGantt={handleViewGantt}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Modal con formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingProyecto ? 'Editar proyecto' : 'Nuevo proyecto'}
                </h2>
              </div>
              <div className="p-6">
                <ProyectoForm
                  proyecto={editingProyecto}
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