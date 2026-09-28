import type { Hito } from '../types'
import clsx from 'clsx'

interface HitosTableProps {
  hitos: Hito[]
  isLoading?: boolean
  onEdit: (hito: Hito) => void
  onDelete: (id: string) => void
}

export default function HitosTable({
  hitos,
  isLoading,
  onEdit,
  onDelete
}: HitosTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando hitos...</div>
      </div>
    )
  }

  if (hitos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay hitos registrados</p>
          <p className="text-sm mt-1">Crea el primero haciendo clic en "Nuevo hito"</p>
        </div>
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    const colores: { [key: string]: string } = {
      'pendiente': 'bg-slate-100 text-slate-700',
      'en_progreso': 'bg-blue-100 text-blue-700',
      'completado': 'bg-green-100 text-green-700'
    }
    return colores[estado] || 'bg-slate-100 text-slate-600'
  }

  const getEstadoIcon = (estado: string) => {
    const iconos: { [key: string]: string } = {
      'pendiente': 'ti-circle',
      'en_progreso': 'ti-player-play',
      'completado': 'ti-circle-check-filled'
    }
    return iconos[estado] || 'ti-circle'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Nombre</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">F. Inicio</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">F. Fin</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Avance</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">% Cobro</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-700">Estado</th>
            <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {hitos.map((hito) => (
            <tr key={hito.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3">
                <span className="font-medium text-slate-900">{hito.nombre}</span>
              </td>
              <td className="px-6 py-3 text-slate-600">
                {new Date(hito.fecha_inicio).toLocaleDateString('es-CL')}
              </td>
              <td className="px-6 py-3 text-slate-600">
                {new Date(hito.fecha_fin).toLocaleDateString('es-CL')}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${hito.avance_porcentaje}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{hito.avance_porcentaje}%</span>
                </div>
              </td>
              <td className="px-6 py-3 text-slate-600 font-medium">{hito.porcentaje_cobro}%</td>
              <td className="px-6 py-3">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                    getEstadoColor(hito.estado)
                  )}
                >
                  <i className={clsx('ti text-xs', getEstadoIcon(hito.estado))} />
                  {hito.estado.replace('_', ' ').charAt(0).toUpperCase() + hito.estado.slice(1).replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(hito)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${hito.nombre}?`)) {
                        onDelete(hito.id)
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