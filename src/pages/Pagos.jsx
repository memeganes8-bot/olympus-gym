import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGym } from '../context/GymContext'
import { CreditCard, Search, X, CheckCircle, TrendingUp } from 'lucide-react'

const fmt = (v) => `$${Number(v).toLocaleString('es-CO')}`

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ background: '#0d1321', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 1 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Pagos() {
  const { clientes, pagos, registrarPago, calcularValor, PLANES, ingresosMes, ingresosTotal } = useGym()
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(false)
  const [success, setSuccess] = useState(null)
  const [form, setForm] = useState({ clienteId: '', dias: 30, fecha: new Date().toISOString().split('T')[0] })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Filtrar pagos huérfanos del localStorage viejo
  const pagosLimpios = pagos.filter(p => p.clienteNombre && p.plan)

  const pagosFiltrados = [...pagosLimpios]
    .reverse()
    .filter(p => p.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()))

  const handlePago = () => {
    if (!form.clienteId) return
    const pago = registrarPago(Number(form.clienteId), Number(form.dias), form.fecha)
    setSuccess(pago)
    setModal(false)
    setForm({ clienteId: '', dias: 30, fecha: new Date().toISOString().split('T')[0] })
    setTimeout(() => setSuccess(null), 4000)
  }

  const valor = calcularValor(Number(form.dias))

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <CreditCard size={20} color="#f59e0b" />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#f59e0b', letterSpacing: 3 }}>FINANZAS</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: 2 }}>
          CONTROL DE <span className="gold-gradient">PAGOS</span>
        </h1>
      </motion.div>

      {/* Resumen contable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 4 }}>INGRESOS DEL MES</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#10b981', lineHeight: 1 }}>{fmt(ingresosMes)}</div>
          </div>
        </div>
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 4 }}>TOTAL HISTÓRICO</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#f59e0b', lineHeight: 1 }}>{fmt(ingresosTotal)}</div>
          </div>
        </div>
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#8b5cf6" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 4 }}>TOTAL PAGOS</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#8b5cf6', lineHeight: 1 }}>{pagosLimpios.length}</div>
          </div>
        </div>
      </motion.div>

      {/* Toast éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
          >
            <CheckCircle size={20} color="#10b981" />
            <span style={{ fontSize: 14, color: '#10b981' }}>
              Pago de {fmt(success.valor)} registrado para {success.clienteNombre} — {success.plan}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 40 }} placeholder="Buscar por nombre del cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <button className="btn-gold" onClick={() => setModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <CreditCard size={16} /> Registrar pago
        </button>
      </motion.div>

      {/* Tabla pagos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha de pago</th>
                <th>Membresía</th>
                <th>Valor pagado</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No hay pagos registrados</td></tr>
              )}
              {pagosFiltrados.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td style={{ fontFamily: 'Space Mono', fontSize: 12, color: '#475569' }}>#{p.id}</td>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.clienteNombre}</td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{p.fecha}</td>
                  <td><span className="badge-active">{p.plan}</span></td>
                  <td style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#10b981' }}>{fmt(p.valor)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal pago */}
      <AnimatePresence>
        {modal && (
          <Modal title="REGISTRAR PAGO" onClose={() => setModal(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label>CLIENTE</label>
                <select className="input" value={form.clienteId} onChange={e => set('clienteId', e.target.value)} style={{ appearance: 'none', cursor: 'pointer' }}>
                  <option value="">Selecciona un cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombres} {c.apellidos} — {c.identificacion}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>MEMBRESÍA</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {PLANES.map(p => (
                    <button
                      key={p.dias}
                      onClick={() => set('dias', p.dias)}
                      style={{
                        padding: '12px 16px', borderRadius: 10,
                        border: `1px solid ${form.dias === p.dias ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                        background: form.dias === p.dias ? 'rgba(245,158,11,0.1)' : 'transparent',
                        color: form.dias === p.dias ? '#f59e0b' : '#64748b',
                        cursor: 'pointer', fontSize: 13, fontFamily: 'Inter',
                        transition: 'all 0.2s', textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{p.label}</div>
                      <div style={{ fontSize: 12, marginTop: 2, color: form.dias === p.dias ? '#f59e0b' : '#475569' }}>
                        {fmt(p.valor)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label>FECHA DE PAGO</label>
                <input type="date" className="input" value={form.fecha} onChange={e => set('fecha', e.target.value)} />
              </div>
              <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>Total a cobrar</span>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#f59e0b' }}>{fmt(valor)}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-ghost" onClick={() => setModal(false)} style={{ flex: 1 }}>Cancelar</button>
                <button className="btn-gold" onClick={handlePago} style={{ flex: 1, opacity: form.clienteId ? 1 : 0.5 }}>Confirmar pago</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}