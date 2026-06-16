import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGym } from '../context/GymContext'
import { LogIn, LogOut, Search, CheckCircle, AlertCircle } from 'lucide-react'

export default function Acceso() {
  const { clientes, registrarEntrada, registrarSalida } = useGym()
  const [busqueda, setBusqueda] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg, ok) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const handleEntrada = (c) => {
    const res = registrarEntrada(c.id)
    showToast(res.ok ? `✅ ${c.nombres} registró su entrada` : res.msg, res.ok)
  }

  const handleSalida = (c) => {
    const res = registrarSalida(c.id)
    showToast(res.ok ? `👋 ${c.nombres} registró su salida` : res.msg, res.ok)
  }

  const filtrados = clientes.filter(c =>
    `${c.nombres} ${c.apellidos} ${c.identificacion}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const dentro = filtrados.filter(c => c.dentro)
  const fuera = filtrados.filter(c => !c.dentro)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <LogIn size={20} color="#f59e0b" />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#f59e0b', letterSpacing: 3 }}>ACCESO</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: 2 }}>
          REGISTRO DE <span className="gold-gradient">ENTRADA / SALIDA</span>
        </h1>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              background: toast.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 12, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}
          >
            {toast.ok ? <CheckCircle size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
            <span style={{ fontSize: 14, color: toast.ok ? '#10b981' : '#ef4444' }}>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buscador */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ position: 'relative', marginBottom: 32 }}>
        <Search size={15} color="#475569" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input className="input" style={{ paddingLeft: 44, fontSize: 15 }} placeholder="Buscar cliente por nombre o cédula..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* En el gym */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>EN EL GYM ({dentro.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dentro.length === 0 && (
              <div className="card" style={{ padding: 24, textAlign: 'center', color: '#475569', fontSize: 13 }}>Nadie dentro del gym</div>
            )}
            {dentro.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(245,158,11,0.2)' }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9', marginBottom: 4 }}>{c.nombres} {c.apellidos}</div>
                  <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#475569' }}>{c.identificacion} · {c.diasRestantes} días</div>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => handleSalida(c)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', fontSize: 12 }}
                >
                  <LogOut size={14} /> Salida
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fuera */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#475569' }} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>FUERA ({fuera.length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fuera.length === 0 && (
              <div className="card" style={{ padding: 24, textAlign: 'center', color: '#475569', fontSize: 13 }}>No hay clientes fuera</div>
            )}
            {fuera.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9', marginBottom: 4 }}>{c.nombres} {c.apellidos}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#475569' }}>{c.identificacion}</span>
                    {c.diasRestantes > 0
                      ? <span className="badge-active">{c.diasRestantes} días</span>
                      : <span className="badge-inactive">Sin días</span>
                    }
                  </div>
                </div>
                <button
                  onClick={() => handleEntrada(c)}
                  disabled={c.diasRestantes <= 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: c.diasRestantes > 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
                    color: c.diasRestantes > 0 ? '#000' : '#475569',
                    border: 'none', borderRadius: 10, padding: '8px 16px',
                    cursor: c.diasRestantes > 0 ? 'pointer' : 'not-allowed',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Inter',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <LogIn size={14} /> Entrada
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
