export type TipoCuenta = 'corriente' | 'ahorro' | 'vista' | 'otro'

export interface Proveedor {
  id: string
  nombre: string
  rut: string
  banco?: string
  numero_cuenta?: string
  tipo_cuenta?: TipoCuenta
  email?: string
  telefono?: string
  contacto?: string
  calle_numero?: string
  comuna?: string
  region?: string
  notas?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export type ProveedorFormData = Omit<Proveedor, 'id' | 'created_at' | 'updated_at'>