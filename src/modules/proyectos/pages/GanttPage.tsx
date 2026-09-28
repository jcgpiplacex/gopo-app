import { useSearchParams } from 'react-router-dom'
import Layout from '../../../shared/components/Layout'
import { useHitos } from '../hooks/useHitos'
import { useProyectos } from '../hooks/useProyectos'

export default function GanttPage() {
  const [searchParams] = useSearchParams()
  const proyectoId = searchParams.get('proyecto_id')

  const { data: proyectos } = useProyectos()
  const { data: hitos, isLoading, error } = useHitos(proyectoId || '')

  const proyectoActual = proyectos?.find(p => p.id === proyectoId)

  if (!proyectoId) {
    return (
      <Layout title="Carta Gantt">
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">Selecciona un proyecto para ver su Carta Gantt</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout title={`Carta Gantt - ${proyectoActual?.nombre || 'Proyecto'}`}>
        <div className="p-6">
          <div className="text-center text-slate-500">Cargando hitos...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title={`Carta Gantt - ${proyectoActual?.nombre || 'Proyecto'}`}>
        <div className="p-6">
          <div className="text-center text-red-600">Error al cargar hitos</div>
        </div>
      </Layout>
    )
  }

  if (!hitos || hitos.length === 0) {
    return (
      <Layout title={`Carta Gantt - ${proyectoActual?.nombre || 'Proyecto'}`}>
        <div className="p-6">
          <div className="text-center text-slate-400">
            <p>No hay hitos para mostrar en Gantt</p>
            <p className="text-sm mt-1">Agrega hitos al proyecto primero</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Calcular fechas mín y máx
  const fechas = hitos.map(h => [new Date(h.fecha_inicio), new Date(h.fecha_fin)] as const)
  const fechaMin = new Date(Math.min(...fechas.map(([inicio]) => inicio.getTime())))
  const fechaMax = new Date(Math.max(...fechas.map(([, fin]) => fin.getTime())))

  // Total de días
  const totalDias = Math.ceil((fechaMax.getTime() - fechaMin.getTime()) / (1000 * 60 * 60 * 24))

  // Función para calcular posición en el gráfico
  const calcularPosicion = (fecha: Date) => {
    const dias = Math.ceil((fecha.getTime() - fechaMin.getTime()) / (1000 * 60 * 60 * 24))
    return (dias / totalDias) * 100
  }

  // Función para calcular ancho en el gráfico
  const calcularAncho = (inicio: Date, fin: Date) => {
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    return (dias / totalDias) * 100
  }

  return (
    <Layout title={`Carta Gantt - ${proyectoActual?.nombre || 'Proyecto'}`}>
      <div className="p-6">
        {/* Información del proyecto */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>{proyectoActual?.nombre}</strong> • 
            {fechaMin.toLocaleDateString('es-CL')} a {fechaMax.toLocaleDateString('es-CL')} 
            ({totalDias} días)
          </p>
        </div>

        {/* Tabla Gantt */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header con fechas */}
              <div className="flex border-b border-slate-200">
                <div className="w-48 bg-slate-50 border-r border-slate-200 p-3 sticky left-0 z-10">
                  <div className="text-xs font-semibold text-slate-700">Hito</div>
                </div>
                <div className="flex-1 bg-slate-50 p-0 relative h-12">
                  {/* Generar fechas día por día */}
                  {Array.from({ length: totalDias + 1 }).map((_, i) => {
                    const fecha = new Date(fechaMin)
                    fecha.setDate(fecha.getDate() + i)
                    const posicion = (i / totalDias) * 100
                    
                    return (
                      <div
                        key={i}
                        className="absolute border-r border-slate-300 text-xs text-slate-600 p-1 flex items-center"
                        style={{
                          left: `${posicion}%`,
                          width: `${(1 / totalDias) * 100}%`
                        }}
                      >
                        {fecha.toLocaleDateString('es-CL', { day: 'numeric' })}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Filas de hitos */}
              {hitos.map((hito) => (
                <div key={hito.id} className="flex border-b border-slate-200 hover:bg-slate-50">
                  <div className="w-48 bg-white border-r border-slate-200 p-3 sticky left-0 z-10">
                    <div className="font-medium text-sm text-slate-900">{hito.nombre}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(hito.fecha_inicio).toLocaleDateString('es-CL')} - 
                      {new Date(hito.fecha_fin).toLocaleDateString('es-CL')}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: hito.color }} />
                      <span className="text-xs text-slate-600">{hito.avance_porcentaje}%</span>
                    </div>
                  </div>
                  <div className="flex-1 relative p-3">
                    {/* Barra de hito */}
                    <div
                      className="h-8 rounded flex items-center px-2 text-xs font-medium text-white relative"
                      style={{
                        backgroundColor: 
                          hito.estado === 'completado' ? '#10b981' :
                          hito.estado === 'en_progreso' ? '#eab308' :
                          '#3b82f6',
                        marginLeft: `${calcularPosicion(new Date(hito.fecha_inicio))}%`,
                        width: `${calcularAncho(new Date(hito.fecha_inicio), new Date(hito.fecha_fin))}%`
                      }}
                    >
                      {hito.nombre}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-6 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>Completado</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}