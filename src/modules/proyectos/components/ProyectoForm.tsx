import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProyectoFormData } from '../types'
import { useClientes } from '../../ventas/hooks/useClientes'
import { useUploadPresupuesto } from '../hooks/useUploadPresupuesto'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional().or(z.literal('')),
  cliente_id: z.string().min(1, 'El cliente es obligatorio'),
  estado: z.enum(['activo', 'pausado', 'terminado', 'cancelado']).default('activo'),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  fecha_fin_estimada: z.string().optional().or(z.literal('')),
  fecha_fin_real: z.string().optional().or(z.literal('')),
  tipo_proyecto: z.enum(['arquitectura', 'construccion']).default('construccion'),
  superficie_m2: z.coerce.number().positive('La superficie debe ser positiva').optional(),
  presupuesto_clp: z.coerce.number().nonnegative('El presupuesto debe ser >= 0').default(0),
  presupuesto_uf: z.coerce.number().nonnegative('El presupuesto debe ser >= 0').default(0),
  moneda_presupuesto: z.enum(['CLP', 'UF']).default('UF'),
  uf_valor_referencia: z.coerce.number().optional(),
  avance_porcentaje: z.coerce.number().min(0).max(100).default(0),
  calle_numero: z.string().optional().or(z.literal('')),
  comuna: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal(''))
})

interface ProyectoFormProps {
  proyecto?: any
  onSubmit: (data: ProyectoFormData) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function ProyectoForm({ proyecto, onSubmit, onClose, isLoading }: ProyectoFormProps) {
  const { data: clientes } = useClientes()
  const [presupuestoArchivo, setPresupuestoArchivo] = useState<File | null>(null)
  const [ufActual, setUfActual] = useState(38500)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: proyecto || {
      moneda_presupuesto: 'UF',
      estado: 'activo',
      avance_porcentaje: 0,
      presupuesto_clp: 0,
      presupuesto_uf: 0
    }
  })

const { uploadPresupuesto } = useUploadPresupuesto()

  const moneda = watch('moneda_presupuesto')
  const presupuestoClp = watch('presupuesto_clp')
  const presupuestoUf = watch('presupuesto_uf')

  // Convertir CLP a UF automáticamente
  useEffect(() => {
    if (moneda === 'CLP' && presupuestoClp) {
      const ufEquivalente = presupuestoClp / ufActual
      setValue('presupuesto_uf', Math.round(ufEquivalente * 100) / 100)
    }
  }, [presupuestoClp, moneda, ufActual, setValue])

  // Convertir UF a CLP automáticamente
  useEffect(() => {
    if (moneda === 'UF' && presupuestoUf) {
      const clpEquivalente = presupuestoUf * ufActual
      setValue('presupuesto_clp', Math.round(clpEquivalente * 100) / 100)
    }
  }, [presupuestoUf, moneda, ufActual, setValue])

  const onSubmitForm = async (data: any) => {
    try {
      // Si hay archivo seleccionado, súbelo
      if (presupuestoArchivo) {
        const id = proyecto?.id || 'temp-' + Date.now()
        const url = await uploadPresupuesto(id, presupuestoArchivo)
        data.presupuesto_archivo_url = url
      }
      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al subir presupuesto')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Sección datos básicos */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Edificio Larrondo"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{String(errors.nombre.message)}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
            <select
              {...register('cliente_id')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes?.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            {errors.cliente_id && <p className="text-red-500 text-xs mt-1">{String(errors.cliente_id.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select
              {...register('estado')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="activo">Activo</option>
              <option value="pausado">Pausado</option>
              <option value="terminado">Terminado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de proyecto *</label>
            <select
              {...register('tipo_proyecto')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="arquitectura">Arquitectura</option>
              <option value="construccion">Construcción</option>
            </select>
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha inicio *</label>
            <input
              {...register('fecha_inicio')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{String(errors.fecha_inicio.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">F. término estimada</label>
            <input
              {...register('fecha_fin_estimada')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">F. término real</label>
            <input
              {...register('fecha_fin_real')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Superficie (m²)</label>
            <input
              {...register('superficie_m2')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del proyecto..."
            />
          </div>
        </div>
      </div>

      {/* Sección presupuesto */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Presupuesto</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Moneda principal</label>
            <select
              {...register('moneda_presupuesto')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="UF">UF</option>
              <option value="CLP">CLP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">UF valor referencia</label>
            <input
              type="number"
              value={ufActual}
              onChange={(e) => setUfActual(Number(e.target.value))}
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Presupuesto CLP</label>
            <input
              {...register('presupuesto_clp')}
              type="number"
              step="any"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Presupuesto UF</label>
            <input
              {...register('presupuesto_uf')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Sección dirección */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Dirección de obra</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Calle y Número</label>
            <input
              {...register('calle_numero')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Av. Principal 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comuna</label>
            <input
              {...register('comuna')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Santiago"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Región</label>
            <input
              {...register('region')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Metropolitana"
            />
          </div>
        </div>
      </div>

      {/* Sección archivo presupuesto */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Presupuesto archivo</h3>
        <label className="block text-sm font-medium text-slate-700 mb-2">Subir XLSX</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setPresupuestoArchivo(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
        />
        {presupuestoArchivo && (
          <p className="text-xs text-green-600 mt-2">Archivo seleccionado: {presupuestoArchivo.name}</p>
        )}
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
          {isLoading ? 'Guardando...' : 'Guardar proyecto'}
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