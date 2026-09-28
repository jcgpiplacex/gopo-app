export interface Cliente {
  id: string
  nombre: string
  rut: string
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

export type ClienteFormData = Omit<Cliente, 'id' | 'created_at' | 'updated_at'>