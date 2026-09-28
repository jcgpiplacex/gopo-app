import type { Proveedor } from '../types'
import clsx from 'clsx'

interface ProveedoresTableProps {
  proveedores: Proveedor[]
  isLoading?: boolean
  onEdit: (proveedor: Proveedor) => void
  onToggleStatus: (proveedor: Proveedor) => void  // ← Agrega esta línea
  onDelete: (id: string) => void
}

export default function ProveedoresTable({
  proveedores,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete
}: ProveedoresTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando proveedores...</div>
      </div>
    )
  }

  if (proveedores.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay proveedores registrados</p>
          <p className="text-sm mt-1">Crea el primero haciendo clic en "Nuevo proveedor"</p>
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
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Banco</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Estado</th>
            <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3">
                <span className="font-medium text-slate-900">{proveedor.nombre}</span>
              </td>
              <td className="px-6 py-3 text-slate-600">{proveedor.rut}</td>
              <td className="px-6 py-3 text-slate-600">{proveedor.email || '—'}</td>
              <td className="px-6 py-3 text-slate-600">{proveedor.banco || '—'}</td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                    proveedor.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  <i className={clsx('ti text-xs', proveedor.activo ? 'ti-circle-check' : 'ti-circle-x')} />
                  {proveedor.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(proveedor)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatus(proveedor)}
                    className={clsx(
                      'px-3 py-1 text-white text-xs rounded font-medium',
                      proveedor.activo
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    )}
                    title={proveedor.activo ? 'Desactivar' : 'Activar'}
                  >
                    {proveedor.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${proveedor.nombre}?`)) {
                        onDelete(proveedor.id)
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