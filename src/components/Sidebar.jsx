import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, CreditCard, LogIn, LogOut, BarChart3, Dumbbell } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/pagos', icon: CreditCard, label: 'Pagos' },
  { to: '/acceso', icon: LogIn, label: 'Acceso' },
  { to: '/reportes', icon: BarChart3, label: 'Reportes' },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '240px',
        minHeight: '100vh',
        background: '#0a1020',
        borderRight: '1px solid rgba(245,158,11,0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '32px 24px 24px', borderBottom: '1px solid rgba(245,158,11,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={20} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '2px', color: '#f59e0b', lineHeight: 1 }}>OLYMPUS</div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '9px', color: '#475569', letterSpacing: '2px' }}>GYM SYSTEM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter',
              color: isActive ? '#000' : '#64748b',
              background: isActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('gradient')) {
                e.currentTarget.style.background = 'rgba(245,158,11,0.08)'
                e.currentTarget.style.color = '#f59e0b'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('gradient')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#64748b'
              }
            }}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(245,158,11,0.08)' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: '#334155', letterSpacing: '1px' }}>
          v1.0.0 · Diego Mendez
        </div>
      </div>
    </motion.aside>
  )
}
