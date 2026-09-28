import type { Cliente } from '../types'
import clsx from 'clsx'

interface ClientesTableProps {
  clientes: Cliente[]
  isLoading?: boolean
  onEdit: (cliente: Cliente) => void
  onToggleStatus: (cliente: Cliente) => void
  onDelete: (id: string) => void
}

export default function ClientesTable({
  clientes,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete
}: ClientesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando clientes...</div>
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay clientes registrados</p>
          <p className="text-sm mt-1">Crea el primero haciendo clic en "Nuevo cliente"</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Nombre</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">RUT</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Email</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Teléfono</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Estado</th>
            <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3">
                <span className="font-medium text-slate-900">{cliente.nombre}</span>
              </td>
              <td className="px-6 py-3 text-slate-600">{cliente.rut}</td>
              <td className="px-6 py-3 text-slate-600">{cliente.email || '—'}</td>
              <td className="px-6 py-3 text-slate-600">{cliente.telefono || '—'}</td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                    cliente.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <i className={clsx('ti text-xs', cliente.activo ? 'ti-circle-check' : 'ti-circle-x')} />
                  {cliente.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(cliente)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatus(cliente)}
                    className={clsx(
                      'px-3 py-1 text-white text-xs rounded font-medium',
                      cliente.activo
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    )}
                    title={cliente.activo ? 'Desactivar' : 'Activar'}
                  >
                    {cliente.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${cliente.nombre}?`)) {
                        onDelete(cliente.id)
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 font-medium"
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}