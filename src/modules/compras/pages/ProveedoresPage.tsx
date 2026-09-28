import { useState } from 'react'
import Layout from '../../../shared/components/Layout'
import ProveedoresTable from '../components/ProveedoresTable'
import { useProveedores, useCrearProveedor, useActualizarProveedor, useEliminarProveedor } from '../hooks/useProveedores'
import type { Proveedor } from '../types'
import ProveedorForm from '../components/ProveedorForm'

export default function ProveedoresPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>()

  const { data: proveedores, isLoading, error } = useProveedores()
  const crearMutation = useCrearProveedor()
  const actualizarMutation = useActualizarProveedor()
  const eliminarMutation = useEliminarProveedor()

  const handleOpenForm = (proveedor?: Proveedor) => {
    setEditingProveedor(proveedor)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProveedor(undefined)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingProveedor) {
        // Si solo cambió activo, envía solo ese campo
        if (Object.keys(data).length === 1 && 'activo' in data) {
          await actualizarMutation.mutateAsync({ 
            ...editingProveedor, 
            activo: data.activo 
          })
        } else {
          await actualizarMutation.mutateAsync({ ...data, id: editingProveedor.id })
        }
      } else {
        await crearMutation.mutateAsync(data)
      }
      handleCloseForm()
    } catch (err) {
      console.error('Error:', err)
      alert('Hubo un error. Intenta de nuevo.')
    }
  }

  const handleToggleStatus = async (proveedor: Proveedor) => {
    try {
      await actualizarMutation.mutateAsync({
        ...proveedor,
        activo: !proveedor.activo
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
      alert('No se pudo eliminar el proveedor')
    }
  }

  return (
    <Layout title="Proveedores">
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Total proveedores</div>
            <div className="text-2xl font-bold text-slate-900">{proveedores?.length || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Activos</div>
            <div className="text-2xl font-bold text-green-600">
              {proveedores?.filter(p => p.activo).length || 0}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-600 font-medium mb-1">Inactivos</div>
            <div className="text-2xl font-bold text-slate-500">
              {proveedores?.filter(p => !p.activo).length || 0}
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
            Nuevo proveedor
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
              <p>Error al cargar proveedores: {error.message}</p>
            </div>
          ) : (
            <ProveedoresTable
              proveedores={proveedores || []}
              isLoading={isLoading}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>

        {/* Modal con formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingProveedor ? 'Editar proveedor' : 'Nuevo proveedor'}
                </h2>
              </div>
              <div className="p-6">
                <ProveedorForm
                  proveedor={editingProveedor}
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