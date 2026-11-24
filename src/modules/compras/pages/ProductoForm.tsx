import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProductoFormData } from '../types'
import { useUFValue } from '../hooks/useUFValue'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional().or(z.literal('')),
  codigo: z.string().optional().or(z.literal('')),
  precio_unitario_clp: z.coerce.number().nonnegative('El precio debe ser >= 0').default(0),
  precio_unitario_uf: z.coerce.number().nonnegative('El precio debe ser >= 0').default(0),
  unidad_medida: z.string().default('unidad'),
  activo: z.boolean().default(true),
  notas: z.string().optional().or(z.literal(''))
})

interface ProductoFormProps {
  producto?: any
  onSubmit: (data: ProductoFormData) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function ProductoForm({ producto, onSubmit, onClose, isLoading }: ProductoFormProps) {
  const { ufValue } = useUFValue()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [lastEditedField, setLastEditedField] = useState<'clp' | 'uf' | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: producto || {
      unidad_medida: 'unidad',
      activo: true,
      precio_unitario_clp: 0,
      precio_unitario_uf: 0
    }
  })

  const precioCLP = watch('precio_unitario_clp')
  const precioUF = watch('precio_unitario_uf')

  // Cuando cambia el precio en CLP, actualizar UF
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (precioCLP && precioCLP > 0 && lastEditedField === 'clp') {
        const precioEnUF = precioCLP / ufValue
        setValue('precio_unitario_uf', Math.round(precioEnUF * 100) / 100)
      }
    }, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [precioCLP, ufValue, setValue, lastEditedField])

  // Cuando cambia el precio en UF, actualizar CLP
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (precioUF && precioUF > 0 && lastEditedField === 'uf') {
        const precioEnCLP = precioUF * ufValue
        setValue('precio_unitario_clp', Math.round(precioEnCLP))
      }
    }, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [precioUF, ufValue, setValue, lastEditedField])

  const onSubmitForm = async (data: any) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Información básica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Hormigón Premium"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{String(errors.nombre.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
            <input
              {...register('codigo')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="HOR-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unidad de medida</label>
            <select
              {...register('unidad_medida')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="unidad">un</option>
              <option value="metro">m</option>
              <option value="kilo">Kg</option>
              <option value="litro">L</option>
              <option value="m2">m²</option>
              <option value="m3">m³</option>
              <option value="global">gl</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              {...register('descripcion')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del producto..."
            />
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Precios</h3>
          <span className="text-xs text-slate-500">UF actual: ${ufValue.toLocaleString('es-CL', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio unitario CLP</label>
            <input
              {...register('precio_unitario_clp')}
              type="number"
              step="any"
              onFocus={() => setLastEditedField('clp')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.precio_unitario_clp && <p className="text-red-500 text-xs mt-1">{String(errors.precio_unitario_clp.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio unitario UF</label>
            <input
              {...register('precio_unitario_uf')}
              type="number"
              step="0.01"
              onFocus={() => setLastEditedField('uf')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.precio_unitario_uf && <p className="text-red-500 text-xs mt-1">{String(errors.precio_unitario_uf.message)}</p>}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Los precios se convierten automáticamente entre CLP y UF</p>
      </div>

      {/* Información adicional */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información adicional</h3>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          {...register('notas')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Notas adicionales..."
        />
      </div>

      {/* Estado */}
      <div>
        <label className="flex items-center gap-2">
          <input
            {...register('activo')}
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">Producto activo</span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {isLoading ? 'Guardando...' : 'Guardar producto'}
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