export type EstadoProyecto = 'activo' | 'pausado' | 'terminado' | 'cancelado'
export type MonedaPresupuesto = 'CLP' | 'UF'
export type TipoProyecto = 'arquitectura' | 'construccion'

export interface Proyecto {
  id: string
  nombre: string
  descripcion?: string
  cliente_id: string
  estado: EstadoProyecto
  fecha_inicio: string
  fecha_fin_estimada?: string
  fecha_fin_real?: string
  tipo_proyecto: TipoProyecto
  superficie_m2?: number
  presupuesto_clp: number
  presupuesto_uf: number
  moneda_presupuesto: MonedaPresupuesto
  uf_valor_referencia?: number
  avance_porcentaje: number
  presupuesto_archivo_url?: string
  calle_numero?: string
  comuna?: string
  region?: string
  notas?: string
  created_at: string
  updated_at: string
}

export type ProyectoFormData = Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>

export interface Hito {
  id: string
  proyecto_id: string
  nombre: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin: string
  avance_porcentaje: number
  porcentaje_cobro: number
  estado: 'pendiente' | 'en_progreso' | 'completado'
  orden: number
  color: string
  notas?: string
  created_at: string
  updated_at: string
}

export type HitoFormData = Omit<Hito, 'id' | 'created_at' | 'updated_at'>

export interface ProyectoProveedor {
  id: string
  proyecto_id: string
  proveedor_id: string
  especialidad: string
  descripcion?: string
  created_at: string
  updated_at: string
}

export type ProyectoProveedorFormData = Omit<ProyectoProveedor, 'id' | 'created_at' | 'updated_at'>