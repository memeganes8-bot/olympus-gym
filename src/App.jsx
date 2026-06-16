import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GymProvider } from './context/GymContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Pagos from './pages/Pagos'
import Acceso from './pages/Acceso'
import Reportes from './pages/Reportes'

export default function App() {
  return (
    <GymProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{
            marginLeft: 240,
            flex: 1,
            padding: '48px 40px',
            minHeight: '100vh',
            background: 'var(--bg)',
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/acceso" element={<Acceso />} />
              <Route path="/reportes" element={<Reportes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </GymProvider>
  )
}
