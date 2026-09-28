import type { Producto } from '../types'
import clsx from 'clsx'

interface ProductosTableProps {
  productos: Producto[]
  isLoading?: boolean
  onEdit: (producto: Producto) => void
  onDelete: (id: string) => void
}

export default function ProductosTable({
  productos,
  isLoading,
  onEdit,
  onDelete
}: ProductosTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando productos...</div>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay productos registrados</p>
          <p className="text-sm mt-1">Crea el primero haciendo clic en "Nuevo producto"</p>
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
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Código</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Categoría</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Precio CLP</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Precio UF</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Stock</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Unidad</th>
            <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3">
                <span className="font-medium text-slate-900">{producto.nombre}</span>
              </td>
              <td className="px-6 py-3 text-slate-600">{producto.codigo || '—'}</td>
              <td className="px-6 py-3 text-slate-600">{producto.categoria || '—'}</td>
              <td className="px-6 py-3 text-slate-600">
                ${producto.precio_unitario_clp.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </td>
              <td className="px-6 py-3 text-slate-600">
                {producto.precio_unitario_uf.toLocaleString('es-CL', { maximumFractionDigits: 2 })} UF
              </td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium',
                    producto.stock > 10
                      ? 'bg-green-100 text-green-700'
                      : producto.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  )}
                >
                  {producto.stock}
                </span>
              </td>
              <td className="px-6 py-3 text-slate-600">{producto.unidad_medida}</td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(producto)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${producto.nombre}?`)) {
                        onDelete(producto.id)
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