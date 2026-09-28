export type TipoCuenta = 'corriente' | 'ahorro' | 'vista' | 'otro'
export type EstadoCotizacion = 'borrador' | 'enviada' | 'aceptada' | 'rechazada'
export type EstadoOrdenCompra = 'borrador' | 'enviada' | 'recibida' | 'cancelada'
export type EstadoFacturaRecibida = 'pendiente' | 'pagada' | 'vencida'
export type Moneda = 'CLP' | 'UF'

// === PROVEEDORES ===
export interface Proveedor {
  id: string
  nombre: string
  rut: string
  banco?: string
  numero_cuenta?: string
  tipo_cuenta?: TipoCuenta
  email: string
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

export interface ProveedorFormData {
  nombre: string
  rut: string
  banco?: string
  numero_cuenta?: string
  tipo_cuenta?: TipoCuenta
  email: string
  telefono?: string
  contacto?: string
  calle_numero?: string
  comuna?: string
  region?: string
  notas?: string
  activo: boolean
}

// === PRODUCTOS ===
export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  codigo?: string
  categoria?: string
  precio_unitario_clp: number
  precio_unitario_uf: number
  unidad_medida: string
  stock: number
  activo: boolean
  notas?: string
  created_at: string
  updated_at: string
}

export interface ProductoFormData {
  nombre: string
  descripcion?: string
  codigo?: string
  categoria?: string
  precio_unitario_clp: number
  precio_unitario_uf: number
  unidad_medida: string
  stock: number
  activo: boolean
  notas?: string
}

// === COTIZACIONES ===
export interface CotizacionItem {
  id: string
  cotizacion_id: string
  producto_id: string
  descripcion?: string
  cantidad: number
  precio_unitario_clp?: number
  precio_unitario_uf?: number
  subtotal_clp?: number
  subtotal_uf?: number
}

export interface Cotizacion {
  id: string
  numero: string
  proveedor_id: string
  proyecto_id: string
  fecha: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoCotizacion
  descripcion?: string
  notas?: string
  archivo_url?: string
  items?: CotizacionItem[]
  created_at: string
  updated_at: string
}

export interface CotizacionFormData {
  numero: string
  proveedor_id: string
  proyecto_id: string
  fecha: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoCotizacion
  descripcion?: string
  notas?: string
}

// === ÓRDENES DE COMPRA ===
export interface OrdenCompraItem {
  id: string
  orden_compra_id: string
  producto_id: string
  descripcion?: string
  cantidad: number
  precio_unitario_clp?: number
  precio_unitario_uf?: number
  subtotal_clp?: number
  subtotal_uf?: number
}

export interface OrdenCompra {
  id: string
  numero: string
  proveedor_id: string
  proyecto_id: string
  cotizacion_id?: string
  fecha: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoOrdenCompra
  descripcion_items?: string
  cantidad_items?: number
  precio_unitario_clp?: number
  pdf_url?: string
  notas?: string
  items?: OrdenCompraItem[]
  created_at: string
  updated_at: string
}

export interface OrdenCompraFormData {
  numero: string
  proveedor_id: string
  proyecto_id: string
  cotizacion_id?: string
  fecha: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoOrdenCompra
  descripcion_items?: string
  cantidad_items?: number
  precio_unitario_clp?: number
  notas?: string
}

// === FACTURAS RECIBIDAS ===
export interface FacturaRecibida {
  id: string
  numero_factura: string
  proveedor_id: string
  proyecto_id: string
  orden_compra_id?: string
  fecha_factura: string
  fecha_vencimiento?: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoFacturaRecibida
  banco_pago?: string
  archivo_url?: string
  notas?: string
  created_at: string
  updated_at: string
}

export interface FacturaRecibidaFormData {
  numero_factura: string
  proveedor_id: string
  proyecto_id: string
  orden_compra_id?: string
  fecha_factura: string
  fecha_vencimiento?: string
  moneda: Moneda
  uf_valor_referencia?: number
  monto_clp?: number
  monto_uf?: number
  estado: EstadoFacturaRecibida
  banco_pago?: string
  notas?: string
}