import { useState } from 'react'
import clsx from 'clsx'
import type { Proyecto } from '../types'
import type { Cliente } from '../../ventas/types'
import PresupuestoModal from './PresupuestoModal'

interface ProyectosTableProps {
  proyectos: Proyecto[]
  clientes: Cliente[]
  isLoading?: boolean
  onEdit: (proyecto: Proyecto) => void
  onViewHitos: (proyectoId: string) => void
  onViewGantt: (proyectoId: string) => void
  onDelete: (id: string) => void
}

const ESTADO_COLORES: Record<string, string> = {
  activo: 'bg-blue-100 text-blue-700',
  pausado: 'bg-yellow-100 text-yellow-700',
  terminado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700'
}

export default function ProyectosTable({
  proyectos,
  clientes,
  isLoading,
  onEdit,
  onViewHitos,
  onViewGantt,
  onDelete
}: ProyectosTableProps) {
  const [presupuestoAbierto, setPresupuestoAbierto] = useState<{ url: string; nombre: string } | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Cargando proyectos...</div>
      </div>
    )
  }

  if (proyectos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400 text-center">
          <i className="ti ti-inbox text-4xl mb-2 block"></i>
          <p>No hay proyectos registrados</p>
          <p className="text-sm mt-1">Crea el primero haciendo clic en "Nuevo proyecto"</p>
        </div>
      </div>
    )
  }

  const getNombreCliente = (clienteId: string) =>
    clientes.find(c => c.id === clienteId)?.nombre || '—'

  const formatPresupuesto = (proyecto: Proyecto) =>
    proyecto.moneda_presupuesto === 'CLP'
      ? `$${proyecto.presupuesto_clp.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`
      : `${proyecto.presupuesto_uf.toLocaleString('es-CL', { maximumFractionDigits: 0 })} UF`

  const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Cliente</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Tipo</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">F. Inicio</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Presupuesto</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Avance</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-700">Estado</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto) => (
              <tr key={proyecto.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3">
                  <span className="font-medium text-slate-900">{proyecto.nombre}</span>
                </td>
                <td className="px-6 py-3 text-slate-600">{getNombreCliente(proyecto.cliente_id)}</td>
                <td className="px-6 py-3 text-slate-600">{capitalizar(proyecto.tipo_proyecto)}</td>
                <td className="px-6 py-3 text-slate-600">
                  {new Date(proyecto.fecha_inicio).toLocaleDateString('es-CL')}
                </td>
                <td className="px-6 py-3 text-slate-600 font-medium">{formatPresupuesto(proyecto)}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${proyecto.avance_porcentaje}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{proyecto.avance_porcentaje}%</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={clsx(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                      ESTADO_COLORES[proyecto.estado] || 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {capitalizar(proyecto.estado)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => onViewHitos(proyecto.id)}
                      className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 font-medium"
                      title="Ver hitos"
                    >
                      Hitos
                    </button>
                    <button
                      onClick={() => onViewGantt(proyecto.id)}
                      className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 font-medium"
                      title="Ver Gantt"
                    >
                      Gantt
                    </button>
                    {proyecto.presupuesto_archivo_url && (
                      <button
                        onClick={() => setPresupuestoAbierto({ 
                          url: proyecto.presupuesto_archivo_url!, 
                          nombre: proyecto.nombre 
                        })}
                        className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 font-medium"
                        title="Ver presupuesto"
                      >
                        Ver Presupuesto
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(proyecto)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar ${proyecto.nombre}?`)) {
                          onDelete(proyecto.id)
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

      {presupuestoAbierto && (
        <PresupuestoModal
          url={presupuestoAbierto.url}
          nombre={presupuestoAbierto.nombre}
          onClose={() => setPresupuestoAbierto(null)}
        />
      )}
    </>
  )
}