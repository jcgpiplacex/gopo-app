import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './shared/components/Layout'
import ProveedoresPage from './modules/compras/pages/ProveedoresPage'
import ClientesPage from './modules/ventas/pages/ClientesPage'
import ProyectosPage from './modules/proyectos/pages/ProyectosPage'
import HitosPage from './modules/proyectos/pages/HitosPage'
import GanttPage from './modules/proyectos/pages/GanttPage'
import ProductosPage from './modules/compras/pages/ProductosPage'
import CotizacionesPage from './modules/compras/pages/CotizacionesPage'

// Páginas placeholder (las crearemos después)
const Dashboard = () => <Layout title="Dashboard"><div className="p-6">Dashboard en construcción</div></Layout>
const ContabilidadPagar = () => <Layout title="Cuentas por pagar"><div className="p-6">Cuentas por pagar en construcción</div></Layout>
const ComprasOC = () => <Layout title="Órdenes de compra"><div className="p-6">OC en construcción</div></Layout>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contabilidad/pagar" element={<ContabilidadPagar />} />
        <Route path="/compras/oc" element={<ComprasOC />} />
        <Route path="/ventas/clientes" element={<ClientesPage />} />
        <Route path="/compras/proveedores" element={<ProveedoresPage />} />
        <Route path="/proyectos" element={<ProyectosPage />} />
        <Route path="/proyectos/hitos" element={<HitosPage />} />
        <Route path="/proyectos/gantt" element={<GanttPage />} />
        <Route path="/compras/productos" element={<ProductosPage />} />
        <Route path="/compras/cotizaciones" element={<CotizacionesPage />} />

        <Route path="*" element={<Layout title="Página no encontrada"><div className="p-6">404</div></Layout>} />
      </Routes>
    </Router>
  )
}

export default App