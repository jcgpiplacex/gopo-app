import { useState } from 'react'
import Layout from '../../../shared/components/Layout'
import ClientesTable from '../components/ClientesTable'
import ClienteForm from '../components/ClienteForm'
import { useClientes, useCrearCliente, useActualizarCliente, useEliminarCliente } from '../hooks/useClientes'
import type { Cliente } from '../types'

export default function ClientesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()

  const { data: clientes, isLoading, error } = useClientes()
  const crearMutation = useCrearCliente()
  const actualizarMutation = useActualizarCliente()
  const eliminarMutation = useEliminarCliente()

  const handleOpenForm = (cliente?: Cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCliente(undefined)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingCliente) {
        await actualizarMutation.mutateAsync({ ...data, id: editingCliente.id })
      } else {
        await crearMutation.mutateAsync(data)
      }
      handleCloseForm()
    } catch (err) {
      console.error('Error:', err)
      alert('Hubo un error. Intenta de nuevo.')
    }
  }

  const handleToggleStatus = async (cliente: Cliente) => {
    try {
      await actualizarMutation.mutateAsync({
        ...cliente,
        activo: !cliente.activo
      })
    } catch (err) {
      console.error('Error:', err)
      alert('No se pudo cambiar el estado')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync(id)
    } catch (err) {
      console.error('Error:', err)
      alert('No se pudo eliminar el cliente')
    }
  }

  return (
    <Layout title="Clientes">
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Total clientes</div>
            <div className="text-2xl font-bold text-slate-900">{clientes?.length || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Activos</div>
            <div className="text-2xl font-bold text-green-600">
              {clientes?.filter(c => c.activo).length || 0}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Inactivos</div>
            <div className="text-2xl font-bold text-slate-500">
              {clientes?.filter(c => !c.activo).length || 0}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Cargando desde</div>
            <div className="text-xs text-slate-600 font-mono">Supabase</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <i className="ti ti-plus text-base" />
            Nuevo cliente
          </button>
          <input
            type="text"
            placeholder="Buscar por nombre o RUT..."
            className="flex-1 max-w-sm px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-600">
              <p>Error al cargar clientes: {error.message}</p>
            </div>
          ) : (
            <ClientesTable
              clientes={clientes || []}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Modal con formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingCliente ? 'Editar cliente' : 'Nuevo cliente'}
                </h2>
              </div>
              <div className="p-6">
                <ClienteForm
                  cliente={editingCliente}
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