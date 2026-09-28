import type { Cotizacion } from '../types'
import type { Proveedor } from '../types'
import type { Proyecto } from '../../proyectos/types'
import clsx from 'clsx'

interface CotizacionesTableProps {
  cotizaciones: Cotizacion[]
  proveedores?: Proveedor[]
  proyectos?: Proyecto[]
  isLoading?: boolean
  onEdit: (cotizacion: Cotizacion) => void
  onDelete: (id: string) => void
}

export default function CotizacionesTable({
  cotizaciones,
  proveedores = [],
  proyectos = [],
  isLoading,
  onEdit,
  onDelete
}: CotizacionesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando cotizaciones...</div>
      </div>
    )
  }

  if (cotizaciones.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay cotizaciones registradas</p>
          <p className="text-sm mt-1">Crea la primera haciendo clic en "Nueva cotización"</p>
        </div>
      </div>
    )
  }

  const getNombreProveedor = (id: string) => proveedores.find(p => p.id === id)?.nombre || '—'
  const getNombreProyecto = (id: string) => proyectos.find(p => p.id === id)?.nombre || '—'

  const getEstadoColor = (estado: string) => {
    const colores: { [key: string]: string } = {
      'borrador': 'bg-slate-100 text-slate-700',
      'enviada': 'bg-blue-100 text-blue-700',
      'aceptada': 'bg-green-100 text-green-700',
      'rechazada': 'bg-red-100 text-red-700'
    }
    return colores[estado] || 'bg-slate-100 text-slate-600'
  }

  const getEstadoIcon = (estado: string) => {
    const iconos: { [key: string]: string } = {
      'borrador': 'ti-file-text',
      'enviada': 'ti-send',
      'aceptada': 'ti-circle-check-filled',
      'rechazada': 'ti-circle-x'
    }
    return iconos[estado] || 'ti-file'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Número</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Proveedor</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Proyecto</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Fecha</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Monto</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Moneda</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Estado</th>
            <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((cotizacion) => (
            <tr key={cotizacion.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3">
                <span className="font-medium text-slate-900">{cotizacion.numero}</span>
              </td>
              <td className="px-6 py-3 text-slate-600">{getNombreProveedor(cotizacion.proveedor_id)}</td>
              <td className="px-6 py-3 text-slate-600">{getNombreProyecto(cotizacion.proyecto_id)}</td>
              <td className="px-6 py-3 text-slate-600">
                {new Date(cotizacion.fecha).toLocaleDateString('es-CL')}
              </td>
              <td className="px-6 py-3 text-slate-600 font-medium">
                {cotizacion.moneda === 'CLP'
                  ? `$${cotizacion.monto_clp?.toLocaleString('es-CL', { maximumFractionDigits: 0 }) || '0'}`
                  : `${cotizacion.monto_uf?.toLocaleString('es-CL', { maximumFractionDigits: 2 }) || '0'} UF`
                }
              </td>
              <td className="px-6 py-3 text-slate-600">{cotizacion.moneda}</td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                    getEstadoColor(cotizacion.estado)
                  )}
                >
                  <i className={clsx('ti text-xs', getEstadoIcon(cotizacion.estado))} />
                  {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(cotizacion)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${cotizacion.numero}?`)) {
                        onDelete(cotizacion.id)
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