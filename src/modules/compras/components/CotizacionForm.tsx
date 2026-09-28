import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CotizacionFormData } from '../types'
import { useProveedores } from '../hooks/useProveedores'
import { useProyectos } from '../../proyectos/hooks/useProyectos'
import { useProductos } from '../hooks/useProductos'

const schema = z.object({
  numero: z.string().min(1, 'El número es obligatorio'),
  proveedor_id: z.string().min(1, 'El proveedor es obligatorio'),
  proyecto_id: z.string().min(1, 'El proyecto es obligatorio'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  moneda: z.enum(['CLP', 'UF']).default('CLP'),
  uf_valor_referencia: z.coerce.number().optional(),
  monto_clp: z.coerce.number().nonnegative().optional(),
  monto_uf: z.coerce.number().nonnegative().optional(),
  estado: z.enum(['borrador', 'enviada', 'aceptada', 'rechazada']).default('borrador'),
  descripcion: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal(''))
})

interface CotizacionFormProps {
  cotizacion?: any
  onSubmit: (data: CotizacionFormData) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function CotizacionForm({ cotizacion, onSubmit, onClose, isLoading }: CotizacionFormProps) {
  const { data: proveedores } = useProveedores()
  const { data: proyectos } = useProyectos()
  const { data: productos } = useProductos()
  const [items, setItems] = useState<any[]>(cotizacion?.items || [])
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [ufActual] = useState(38500)

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: cotizacion || {
      moneda: 'CLP',
      estado: 'borrador',
      fecha: new Date().toISOString().split('T')[0],
      uf_valor_referencia: ufActual
    }
  })

  const moneda = watch('moneda')

  const agregarProducto = () => {
    const producto = productos?.find(p => p.id === productoSeleccionado)
    if (!producto || cantidad <= 0) return

    const precioUnitario = moneda === 'CLP' ? producto.precio_unitario_clp : producto.precio_unitario_uf
    const subtotal = precioUnitario * cantidad

    const nuevoItem = {
      id: `temp-${Date.now()}`,
      producto_id: producto.id,
      descripcion: producto.nombre,
      cantidad,
      precio_unitario_clp: producto.precio_unitario_clp,
      precio_unitario_uf: producto.precio_unitario_uf,
      subtotal_clp: moneda === 'CLP' ? subtotal : subtotal * ufActual,
      subtotal_uf: moneda === 'UF' ? subtotal : subtotal / ufActual
    }

    setItems([...items, nuevoItem])
    setProductoSeleccionado('')
    setCantidad(1)

    // Actualizar monto total
    const total = items.reduce((sum, item) => sum + (moneda === 'CLP' ? item.subtotal_clp : item.subtotal_uf), 0) + subtotal
    if (moneda === 'CLP') {
      setValue('monto_clp', total)
      setValue('monto_uf', total / ufActual)
    } else {
      setValue('monto_uf', total)
      setValue('monto_clp', total * ufActual)
    }
  }

  const eliminarItem = (id: string) => {
    const nuevosItems = items.filter(i => i.id !== id)
    setItems(nuevosItems)

    // Recalcular total
    const total = nuevosItems.reduce((sum, item) => sum + (moneda === 'CLP' ? item.subtotal_clp : item.subtotal_uf), 0)
    if (moneda === 'CLP') {
      setValue('monto_clp', total)
      setValue('monto_uf', total / ufActual)
    } else {
      setValue('monto_uf', total)
      setValue('monto_clp', total * ufActual)
    }
  }

  const onSubmitForm = async (data: any) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const totalCLP = items.reduce((sum, item) => sum + item.subtotal_clp, 0)
  const totalUF = items.reduce((sum, item) => sum + item.subtotal_uf, 0)

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Información básica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número *</label>
            <input
              {...register('numero')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="COT-001"
            />
            {errors.numero && <p className="text-red-500 text-xs mt-1">{String(errors.numero.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
            <input
              {...register('fecha')}
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fecha && <p className="text-red-500 text-xs mt-1">{String(errors.fecha.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor *</label>
            <select
              {...register('proveedor_id')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proveedor...</option>
              {proveedores?.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.proveedor_id && <p className="text-red-500 text-xs mt-1">{String(errors.proveedor_id.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Proyecto *</label>
            <select
              {...register('proyecto_id')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar proyecto...</option>
              {proyectos?.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errors.proyecto_id && <p className="text-red-500 text-xs mt-1">{String(errors.proyecto_id.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Moneda</label>
            <select
              {...register('moneda')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CLP">CLP</option>
              <option value="UF">UF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select
              {...register('estado')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="borrador">Borrador</option>
              <option value="enviada">Enviada</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Items</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
            <select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {productos?.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={agregarProducto}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Tabla de items */}
        {items.length > 0 && (
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="px-3 py-2 text-left">Descripción</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Precio Unitario</th>
                  <th className="px-3 py-2 text-right">Subtotal</th>
                  <th className="px-3 py-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="px-3 py-2">{item.descripcion}</td>
                    <td className="px-3 py-2 text-right">{item.cantidad}</td>
                    <td className="px-3 py-2 text-right">
                      {moneda === 'CLP'
                        ? `$${item.precio_unitario_clp.toLocaleString('es-CL')}`
                        : `${item.precio_unitario_uf.toLocaleString('es-CL')} UF`
                      }
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {moneda === 'CLP'
                        ? `$${item.subtotal_clp.toLocaleString('es-CL')}`
                        : `${item.subtotal_uf.toLocaleString('es-CL')} UF`
                      }
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => eliminarItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold border-t-2 border-slate-300">
                  <td colSpan={3} className="px-3 py-2 text-right">Total:</td>
                  <td className="px-3 py-2 text-right">
                    {moneda === 'CLP'
                      ? `$${totalCLP.toLocaleString('es-CL')}`
                      : `${totalUF.toLocaleString('es-CL')} UF`
                    }
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          {...register('notas')}
          rows={2}
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
          {isLoading ? 'Guardando...' : 'Guardar cotización'}
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