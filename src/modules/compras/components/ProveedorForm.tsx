import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProveedorFormData } from '../types'

// Función para validar RUT chileno
const validarRUT = (rut: string): boolean => {
  rut = rut.replace(/\./g, '').replace(/-/g, '')
  if (!/^[0-9]{8}[0-9Kk]$/.test(rut)) return false
  
  let suma = 0
  let multiplo = 2
  
  for (let i = rut.length - 2; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplo
    multiplo++
    if (multiplo > 7) multiplo = 2
  }
  
  const digito = 11 - (suma % 11)
  const dvEsperado = digito === 11 ? '0' : digito === 10 ? 'K' : String(digito)
  
  return rut[rut.length - 1].toUpperCase() === dvEsperado
}

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  rut: z.string()
    .min(1, 'El RUT es obligatorio')
    .refine(validarRUT, 'RUT inválido. Formato: XX.XXX.XXX-X'),
  banco: z.string().optional().or(z.literal('')),
  numero_cuenta: z.string().optional().or(z.literal('')),
  tipo_cuenta: z.enum(['corriente', 'ahorro', 'vista', 'otro']).optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(val),
      'Teléfono debe comenzar con +56 y ser chileno. Ej: +56 9 1234 5678'
    ),
  contacto: z.string().optional().or(z.literal('')),
  calle_numero: z.string().optional().or(z.literal('')),
  comuna: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal('')),
  activo: z.boolean().default(true)
})

interface ProveedorFormProps {
  proveedor?: any
  onSubmit: (data: ProveedorFormData) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function ProveedorForm({ proveedor, onSubmit, onClose, isLoading }: ProveedorFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: proveedor || {}
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
      {/* Sección datos básicos */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Hormigones del Sur"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{String(errors.nombre.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">RUT *</label>
            <input
              {...register('rut')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 76.123.456-7"
            />
            {errors.rut && <p className="text-red-500 text-xs mt-1">{String(errors.rut.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="contacto@empresa.cl"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              {...register('telefono')}
              type="tel"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{String(errors.telefono.message)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
            <input
              {...register('contacto')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del contacto"
            />
          </div>
        </div>
      </div>

      {/* Sección datos bancarios */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Datos bancarios</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Banco</label>
            <input
              {...register('banco')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="BCI, Santander, etc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">N° Cuenta</label>
            <input
              {...register('numero_cuenta')}
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Cuenta</label>
            <select
              {...register('tipo_cuenta')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="corriente">Corriente</option>
              <option value="ahorro">Ahorro</option>
              <option value="vista">Vista</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección dirección de facturación */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Dirección de facturación</h3>
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

      {/* Sección notas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Información adicional</h3>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
        <textarea
          {...register('notas')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Información adicional..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {isLoading ? 'Guardando...' : 'Guardar proveedor'}
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