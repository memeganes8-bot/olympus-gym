import { motion } from 'framer-motion'
import { useGym } from '../context/GymContext'
import { Users, TrendingUp, DollarSign, Activity, Dumbbell, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { dia: 'Lun', ingresos: 180000 },
  { dia: 'Mar', ingresos: 240000 },
  { dia: 'Mié', ingresos: 90000 },
  { dia: 'Jue', ingresos: 320000 },
  { dia: 'Vie', ingresos: 410000 },
  { dia: 'Sáb', ingresos: 560000 },
  { dia: 'Dom', ingresos: 290000 },
]

const fmt = (v) => `$${v.toLocaleString('es-CO')}`

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card"
      style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 1, color: '#f1f5f9', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, fontFamily: 'Space Mono' }}>{sub}</div>}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d1321', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 16px' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: 12, color: '#f59e0b' }}>{fmt(payload[0].value)}</div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { clientes, clientesDentro, clientesActivos, ingresosMes, movimientos } = useGym()

  const getNombre = (id) => {
    const c = clientes.find(x => x.id === id)
    return c ? `${c.nombres} ${c.apellidos}` : null
  }

  // Solo movimientos de clientes que existen actualmente
  const ultimosMovimientos = [...movimientos]
    .reverse()
    .filter(m => getNombre(m.clienteId) !== null)
    .slice(0, 5)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 40 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Dumbbell size={22} color="#f59e0b" />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#f59e0b', letterSpacing: 3 }}>OLYMPUS GYM</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(36px,5vw,56px)', letterSpacing: 2, lineHeight: 1 }}>
          PANEL DE <span className="gold-gradient">CONTROL</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={Users} label="Total clientes" value={clientes.length} sub="registrados" color="#3b82f6" delay={0.1} />
        <StatCard icon={Activity} label="Dentro ahora" value={clientesDentro.length} sub="en el gym" color="#f59e0b" delay={0.15} />
        <StatCard icon={TrendingUp} label="Clientes activos" value={clientesActivos.length} sub="con días vigentes" color="#10b981" delay={0.2} />
        <StatCard icon={DollarSign} label="Ingresos del mes" value={fmt(ingresosMes)} sub="este mes" color="#8b5cf6" delay={0.25} />
      </div>

      {/* Chart + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: 28 }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 6 }}>INGRESOS</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>Esta semana</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dia" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={2} fill="url(#gold)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
          style={{ padding: 28 }}
        >
          <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 6 }}>ACTIVIDAD</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1, marginBottom: 20 }}>Reciente</div>

          {ultimosMovimientos.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <Activity size={32} color="#1e293b" style={{ margin: '0 auto 10px' }} />
              <p style={{ color: '#475569', fontSize: 13 }}>Sin actividad aún</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ultimosMovimientos.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: m.tipo === 'entrada' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${m.tipo === 'entrada' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {m.tipo === 'entrada'
                      ? <Activity size={15} color="#10b981" />
                      : <Clock size={15} color="#ef4444" />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getNombre(m.clienteId)}
                    </div>
                    <div style={{ fontSize: 11, color: m.tipo === 'entrada' ? '#10b981' : '#ef4444', fontFamily: 'Space Mono' }}>
                      {m.tipo === 'entrada' ? '↑ Entrada' : '↓ Salida'} · {new Date(m.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Clientes dentro ahora */}
      {clientesDentro.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ padding: 28, marginTop: 16 }}
        >
          <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#f59e0b', letterSpacing: 2, marginBottom: 6 }}>EN VIVO</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1, marginBottom: 20 }}>Clientes en el gym ahora</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {clientesDentro.map(c => (
              <div key={c.id} style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 10,
                padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
                <span style={{ fontSize: 13, color: '#f1f5f9' }}>{c.nombres} {c.apellidos}</span>
                <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b' }}>{c.diasRestantes} días</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}