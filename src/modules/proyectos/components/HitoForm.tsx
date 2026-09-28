import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { HitoFormData } from '../types'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional().or(z.literal('')),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  fecha_fin: z.string().min(1, 'La fecha de fin es obligatoria'),
  avance_porcentaje: z.coerce.number().min(0).max(100).default(0),
  porcentaje_cobro: z.coerce.number().min(0).max(100).default(0),
  estado: z.enum(['pendiente', 'en_progreso', 'completado']).default('pendiente'),
  orden: z.coerce.number().default(0),
  color: z.string().default('#3b82f6'),
  notas: z.string().optional().or(z.literal(''))
})

interface HitoFormProps {
  hito?: any
  onSubmit: (data: HitoFormData) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function HitoForm({ hito, onSubmit, onClose, isLoading }: HitoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: hito || {
      estado: 'pendiente',
      avance_porcentaje: 0,
      porcentaje_cobro: 0,
      color: '#3b82f6',
      orden: 0
    }
  })

  const onSubmitForm = async (data: any) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Sección información básica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Fundaciones"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{String(errors.nombre.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">F. Inicio *</label>
            <input
              {...register('fecha_inicio')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{String(errors.fecha_inicio.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">F. Fin *</label>
            <input
              {...register('fecha_fin')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{String(errors.fecha_fin.message)}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del hito..."
            />
          </div>
        </div>
      </div>

      {/* Sección avance y cobro */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Seguimiento</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Avance (%)</label>
            <input
              {...register('avance_porcentaje')}
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">% Cobro</label>
            <input
              {...register('porcentaje_cobro')}
              type="number"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select
              {...register('estado')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Orden</label>
            <input
              {...register('orden')}
              type="number"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Sección color */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Visualización</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color (Gantt)</label>
            <input
              {...register('color')}
              type="color"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 h-10"
            />
          </div>
        </div>
      </div>

      {/* Sección notas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información adicional</h3>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          {...register('notas')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Notas adicionales..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {isLoading ? 'Guardando...' : 'Guardar hito'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-md hover:bg-slate-300 text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}