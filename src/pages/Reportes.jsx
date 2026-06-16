import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGym } from '../context/GymContext'
import { BarChart3, Printer, Users, CreditCard, TrendingUp, Calendar } from 'lucide-react'

const fmt = (v) => `$${Number(v).toLocaleString('es-CO')}`

export default function Reportes() {
  const { clientes, pagos, ingresosMes, ingresosTotal } = useGym()
  const printRef1 = useRef()
  const printRef2 = useRef()
  const [mesFiltro, setMesFiltro] = useState(new Date().toISOString().slice(0, 7))

  const imprimir = (ref, titulo) => {
    const contenido = ref.current.innerHTML
    const ventana = window.open('', '_blank')
    ventana.document.write(`
      <html><head><title>Olympus Gym - ${titulo}</title>
      <style>
        body { font-family: Inter, sans-serif; color: #1e293b; padding: 32px; }
        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
        .logo { font-size: 32px; font-weight: 900; letter-spacing: 3px; color: #d97706; }
        .sub { font-size: 12px; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; }
        h2 { font-size: 22px; font-weight: 800; margin: 24px 0 4px; color: #0f172a; }
        .meta { color: #94a3b8; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { text-align: left; padding: 10px 14px; border-bottom: 2px solid #e2e8f0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .badge { background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 6px; font-size: 11px; }
        .badge-gold { background: #fef3c7; color: #d97706; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
        .total-row { background: #f8fafc; font-weight: 700; }
        .summary { display: flex; gap: 24px; margin: 20px 0; }
        .summary-item { background: #f8fafc; border-radius: 10px; padding: 16px 20px; flex: 1; }
        .summary-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .summary-value { font-size: 24px; font-weight: 800; color: #0f172a; }
      </style></head><body>${contenido}</body></html>
    `)
    ventana.document.close()
    ventana.print()
  }

  // Pagos del mes seleccionado
  const pagosMes = pagos.filter(p => p.fecha?.startsWith(mesFiltro))
  const totalMesFiltro = pagosMes.reduce((s, p) => s + p.valor, 0)

  // Plan más vendido
  const conteoPlanes = pagos.reduce((acc, p) => {
    acc[p.plan] = (acc[p.plan] || 0) + 1
    return acc
  }, {})
  const planTop = Object.entries(conteoPlanes).sort((a, b) => b[1] - a[1])[0]

  // Meses disponibles para filtrar
  const mesesDisponibles = [...new Set(pagos.map(p => p.fecha?.slice(0, 7)))].filter(Boolean).sort().reverse()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <BarChart3 size={20} color="#f59e0b" />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#f59e0b', letterSpacing: 3 }}>INFORMES</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: 2 }}>
          REPORTES <span className="gold-gradient">DEL SISTEMA</span>
        </h1>
      </motion.div>

      {/* Resumen general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        {[
          { icon: TrendingUp, label: 'Ingresos este mes', value: fmt(ingresosMes), color: '#10b981' },
          { icon: CreditCard, label: 'Total histórico', value: fmt(ingresosTotal), color: '#f59e0b' },
          { icon: Users, label: 'Total clientes', value: clientes.length, color: '#3b82f6' },
          { icon: BarChart3, label: 'Plan más vendido', value: planTop ? planTop[0] : '—', color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Icon size={16} color={color} />
              <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', letterSpacing: 1 }}>{label.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, color, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </motion.div>

      {/* Reporte 1 — Contabilidad por mes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <CreditCard size={18} color="#f59e0b" />
              <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#f59e0b', letterSpacing: 2 }}>REPORTE 1</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>Contabilidad de membresías</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Pagos registrados con cliente, membresía y valor cobrado</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={14} color="#64748b" />
              <select
                className="input"
                style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                value={mesFiltro}
                onChange={e => setMesFiltro(e.target.value)}
              >
                <option value="">Todos los meses</option>
                {mesesDisponibles.map(m => (
                  <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}</option>
                ))}
              </select>
            </div>
            <button className="btn-ghost" onClick={() => imprimir(printRef1, 'Contabilidad')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Printer size={15} /> Imprimir
            </button>
          </div>
        </div>

        <div ref={printRef1}>
          {/* Solo visible al imprimir */}
          <div className="header" style={{ display: 'none' }}>
            <div>
              <div className="logo">🔱 OLYMPUS GYM</div>
              <div className="sub">Sistema de Gestión</div>
            </div>
          </div>
          <h2 style={{ display: 'none' }}>Reporte de Contabilidad — Membresías</h2>
          <p className="meta" style={{ display: 'none' }}>
            {mesFiltro
              ? new Date(mesFiltro + '-01').toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
              : 'Todos los períodos'
            } · Generado el {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Resumen para imprimir */}
          <div className="summary" style={{ display: 'none' }}>
            <div className="summary-item">
              <div className="summary-label">Total recaudado</div>
              <div className="summary-value">{fmt(mesFiltro ? totalMesFiltro : ingresosTotal)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Número de pagos</div>
              <div className="summary-value">{mesFiltro ? pagosMes.length : pagos.length}</div>
            </div>
          </div>

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
                {(mesFiltro ? pagosMes : pagos).length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#475569', padding: 32 }}>Sin pagos en este período</td></tr>
                )}
                {(mesFiltro ? pagosMes : pagos).map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 12, color: '#475569' }}>#{p.id}</td>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.clienteNombre}</td>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{p.fecha}</td>
                    <td><span className="badge-active">{p.plan}</span></td>
                    <td style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#10b981' }}>{fmt(p.valor)}</td>
                  </tr>
                ))}
                {/* Fila total */}
                {(mesFiltro ? pagosMes : pagos).length > 0 && (
                  <tr style={{ borderTop: '2px solid rgba(245,158,11,0.2)' }}>
                    <td colSpan={4} style={{ fontFamily: 'Space Mono', fontSize: 12, color: '#f59e0b', paddingTop: 16 }}>TOTAL RECAUDADO</td>
                    <td style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#f59e0b', paddingTop: 16 }}>
                      {fmt(mesFiltro ? totalMesFiltro : ingresosTotal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Reporte 2 — Listado general de clientes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Users size={18} color="#3b82f6" />
              <span style={{ fontFamily: 'Space Mono', fontSize: 10, color: '#3b82f6', letterSpacing: 2 }}>REPORTE 2</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>Listado general de clientes</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Todos los clientes con sus datos y estado de membresía</p>
          </div>
          <button className="btn-ghost" onClick={() => imprimir(printRef2, 'Clientes')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Printer size={15} /> Imprimir
          </button>
        </div>

        <div ref={printRef2}>
          <div className="header" style={{ display: 'none' }}>
            <div>
              <div className="logo">🔱 OLYMPUS GYM</div>
              <div className="sub">Sistema de Gestión</div>
            </div>
          </div>
          <h2 style={{ display: 'none' }}>Listado General de Clientes</h2>
          <p className="meta" style={{ display: 'none' }}>
            Generado el {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>Identificación</th>
                  <th>Celular</th>
                  <th>Género</th>
                  <th>Inscripción</th>
                  <th>Membresía activa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#475569', padding: 32 }}>Sin clientes registrados</td></tr>
                )}
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.nombres} {c.apellidos}</td>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{c.identificacion}</td>
                    <td>{c.celular}</td>
                    <td>{c.genero}</td>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{c.fechaInscripcion}</td>
                    <td>
                      {(() => {
                        const ultimoPago = [...pagos].reverse().find(p => p.clienteId === c.id)
                        return ultimoPago
                          ? <span className="badge-active">{ultimoPago.plan}</span>
                          : <span style={{ color: '#475569', fontSize: 12 }}>Sin membresía</span>
                      })()}
                    </td>
                    <td>
                      {c.dentro
                        ? <span className="badge-inside">En gym</span>
                        : c.diasRestantes > 0
                          ? <span className="badge-active">Activo</span>
                          : <span className="badge-inactive">Inactivo</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, fontFamily: 'Space Mono', fontSize: 11, color: '#475569' }}>
            Total de clientes: {clientes.length} · Activos: {clientes.filter(c => c.diasRestantes > 0).length} · Inactivos: {clientes.filter(c => c.diasRestantes === 0).length}
          </div>
        </div>
      </motion.div>
    </div>
  )
}