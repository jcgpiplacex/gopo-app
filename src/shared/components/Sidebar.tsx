import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import clsx from 'clsx'

interface NavItem {
  label: string
  icon: string
  path?: string
  children?: NavItem[]
}

const modules: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'ti-layout-dashboard',
    path: '/'
  },
  {
    label: 'Proyectos',
    icon: 'ti-building-skyscraper',
    children: [
      { label: 'Obras', icon: 'ti-building', path: '/proyectos?tipo=construccion' },
      { label: 'Arquitectura', icon: 'ti-pencil-ruler', path: '/proyectos?tipo=arquitectura' },
      { label: 'Todos', icon: 'ti-list', path: '/proyectos' }
    ]
  },
  {
    label: 'Contabilidad',
    icon: 'ti-report-money',
    children: [
      { label: 'Resumen', icon: 'ti-chart-pie', path: '/contabilidad' },
      { label: 'Ctas. por pagar', icon: 'ti-file-invoice', path: '/contabilidad/pagar' },
      { label: 'Ctas. por cobrar', icon: 'ti-cash', path: '/contabilidad/cobrar' },
      { label: 'Flujo de caja', icon: 'ti-chart-line', path: '/contabilidad/flujo' }
    ]
  },
  {
    label: 'Compras',
    icon: 'ti-shopping-cart',
    children: [
      { label: 'Órdenes de compra', icon: 'ti-clipboard-list', path: '/compras/oc' },
      { label: 'Cotizaciones', icon: 'ti-file-text', path: '/compras/cotizaciones' },
      { label: 'Proveedores', icon: 'ti-truck', path: '/compras/proveedores' },
      { label: 'Facturas recibidas', icon: 'ti-receipt', path: '/compras/facturas' }
    ]
  },
  {
    label: 'Ventas',
    icon: 'ti-speakerphone',
    children: [
      { label: 'Clientes', icon: 'ti-users', path: '/ventas/clientes' },
      { label: 'Presupuestos', icon: 'ti-file-dollar', path: '/ventas/presupuestos' },
      { label: 'Contratos', icon: 'ti-writing', path: '/ventas/contratos' },
      { label: 'Facturas emitidas', icon: 'ti-receipt-2', path: '/ventas/facturas' }
    ]
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedModule, setExpandedModule] = React.useState<string | null>('Proyectos')

  const isSubitemActive = (subitem: NavItem) => {
    // Para proyectos, comparar también query params
    if (subitem.path?.includes('?')) {
      const [path, query] = subitem.path.split('?')
      const currentParams = new URLSearchParams(location.search)
      const subitemParams = new URLSearchParams(query)

      return (
        location.pathname === path &&
        currentParams.toString() === subitemParams.toString()
      )
    }

    // Para rutas sin query params, solo activar si NO hay query params en la URL actual
    return location.pathname === subitem.path && location.search === ''
  }

  return (
    <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-sm font-bold">
          G
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Gopo App</div>
          <div className="text-xs text-slate-500">Duotempus</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map((module) => (
          <div key={module.label} className="mb-1">
            {/* Module header */}
            <button
              onClick={() => {
                if (module.children) {
                  setExpandedModule(expandedModule === module.label ? null : module.label)
                } else if (module.path) {
                  navigate(module.path)
                }
              }}
              className={clsx(
                'w-full flex items-center gap-2 px-4 py-2 text-sm cursor-pointer rounded-lg mx-1 transition-colors',
                location.pathname === module.path
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <i className={`ti ${module.icon} text-base flex-shrink-0`} />
              <span className="flex-1 text-left">{module.label}</span>
              {module.children && (
                <i
                  className={clsx(
                    'ti ti-chevron-down text-xs transition-transform flex-shrink-0',
                    expandedModule === module.label ? 'rotate-180' : ''
                  )}
                />
              )}
            </button>

            {/* Sub-items */}
            {module.children && expandedModule === module.label && (
              <div className="mt-1">
                {module.children.map((subitem) => (
                  <button
                    key={subitem.path}
                    onClick={() => navigate(subitem.path!)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-6 py-1.5 text-xs rounded-lg mx-1 transition-colors',
                      isSubitemActive(subitem)
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <i className={`ti ${subitem.icon} text-sm flex-shrink-0`} />
                    <span className="flex-1 text-left">{subitem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}