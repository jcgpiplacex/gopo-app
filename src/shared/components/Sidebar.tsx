import { useLocation } from 'react-router-dom'
import clsx from 'clsx'

interface NavItem {
  label: string
  icon: string
  path?: string
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'ti-layout-dashboard', path: '/' },
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
    label: 'Compras',
    icon: 'ti-shopping-cart',
    children: [
      { label: 'Productos', icon: 'ti-package', path: '/compras/productos' },
      { label: 'Cotizaciones', icon: 'ti-file-text', path: '/compras/cotizaciones' },
      { label: 'Órdenes de Compra', icon: 'ti-receipt', path: '/compras/ordenes' },
      { label: 'Facturas Recibidas', icon: 'ti-invoice', path: '/compras/facturas' }
    ]
  },
  {
    label: 'Ventas',
    icon: 'ti-cash',
    children: [
      { label: 'Clientes', icon: 'ti-users', path: '/ventas/clientes' },
      { label: 'Presupuestos', icon: 'ti-file-text', path: '/ventas/presupuestos' },
      { label: 'Contratos', icon: 'ti-file', path: '/ventas/contratos' },
      { label: 'Facturas Emitidas', icon: 'ti-invoice', path: '/ventas/facturas' }
    ]
  },
  {
    label: 'Contabilidad',
    icon: 'ti-calculator',
    children: [
      { label: 'Flujo de Caja', icon: 'ti-chart-line', path: '/contabilidad/flujo' },
      { label: 'Cuentas por Pagar', icon: 'ti-alert-circle', path: '/contabilidad/pagar' },
      { label: 'Cuentas por Cobrar', icon: 'ti-alert-circle', path: '/contabilidad/cobrar' }
    ]
  }
]

export default function Sidebar() {
  const location = useLocation()

  const isSubitemActive = (subitem: NavItem) => {
    if (subitem.path?.includes('?')) {
      const [path, query] = subitem.path.split('?')
      const currentParams = new URLSearchParams(location.search)
      const subitemParams = new URLSearchParams(query)
      return (
        location.pathname === path &&
        currentParams.toString() === subitemParams.toString()
      )
    }
    return location.pathname === subitem.path && location.search === ''
  }

  const isParentActive = (parent: NavItem) => {
    return parent.children?.some(child => isSubitemActive(child))
  }

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            G
          </div>
          <div>
            <div className="font-bold text-sm">Gopo App</div>
            <div className="text-xs text-slate-400">Duotempus</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {NAV_ITEMS.map((item, idx) => (
          <div key={idx}>
            {item.path ? (
              <a
                href={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                <i className={clsx('ti', item.icon, 'text-base')} />
                {item.label}
              </a>
            ) : (
              <div>
                <div
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isParentActive(item) ? 'bg-blue-600/10 text-white' : 'text-slate-300'
                  )}
                >
                  <i className={clsx('ti', item.icon, 'text-base')} />
                  {item.label}
                </div>

                <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                  {item.children?.map((child, childIdx) => (
                    <a
                      key={childIdx}
                      href={child.path}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors',
                        isSubitemActive(child)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      )}
                    >
                      <i className={clsx('ti', child.icon, 'text-xs')} />
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
        <p>© 2024 Duotempus</p>
      </div>
    </div>
  )
}