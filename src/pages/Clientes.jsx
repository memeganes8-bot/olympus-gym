import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGym } from '../context/GymContext'
import { UserPlus, Search, Edit2, Trash2, X, Check, Users } from 'lucide-react'

const GENEROS = ['Masculino', 'Femenino', 'Otro']

const empty = { nombres: '', apellidos: '', identificacion: '', celular: '', genero: 'Masculino' }

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          background: '#0d1321',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 20,
          padding: 32,
          width: '100%',
          maxWidth: 480,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 1 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

function ClienteForm({ initial = empty, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const valid = form.nombres && form.apellidos && form.identificacion && form.celular

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label>NOMBRES</label>
          <input className="input" value={form.nombres} onChange={e => set('nombres', e.target.value)} placeholder="Carlos Andrés" />
        </div>
        <div>
          <label>APELLIDOS</label>
          <input className="input" value={form.apellidos} onChange={e => set('apellidos', e.target.value)} placeholder="Gómez Pérez" />
        </div>
      </div>
      <div>
        <label>IDENTIFICACIÓN</label>
        <input className="input" value={form.identificacion} onChange={e => set('identificacion', e.target.value)} placeholder="1098765432" />
      </div>
      <div>
        <label>CELULAR</label>
        <input className="input" value={form.celular} onChange={e => set('celular', e.target.value)} placeholder="3001234567" />
      </div>
      <div>
        <label>GÉNERO</label>
        <select className="input" value={form.genero} onChange={e => set('genero', e.target.value)}
          style={{ appearance: 'none', cursor: 'pointer' }}>
          {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn-ghost" onClick={onCancel} style={{ flex: 1 }}>Cancelar</button>
        <button className="btn-gold" onClick={() => valid && onSave(form)} style={{ flex: 1, opacity: valid ? 1 : 0.5 }}>
          Guardar
        </button>
      </div>
    </div>
  )
}

export default function Clientes() {
  const { clientes, agregarCliente, editarCliente, eliminarCliente } = useGym()
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null) // 'nuevo' | {cliente}
  const [confirmDel, setConfirmDel] = useState(null)

  const filtrados = clientes.filter(c =>
    `${c.nombres} ${c.apellidos} ${c.identificacion}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleGuardar = (data) => {
    if (modal === 'nuevo') {
      agregarCliente(data)
    } else {
      editarCliente(modal.id, data)
    }
    setModal(null)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Users size={20} color="#f59e0b" />
          <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#f59e0b', letterSpacing: 3 }}>GESTIÓN</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: 2 }}>
          CLIENTES <span className="gold-gradient">REGISTRADOS</span>
        </h1>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <button className="btn-gold" onClick={() => setModal('nuevo')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <UserPlus size={16} /> Nuevo cliente
        </button>
      </motion.div>

      {/* Tabla */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Identificación</th>
                <th>Celular</th>
                <th>Género</th>
                <th>Inscripción</th>
                <th>Días restantes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No se encontraron clientes</td></tr>
              )}
              {filtrados.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{c.nombres} {c.apellidos}</td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{c.identificacion}</td>
                  <td>{c.celular}</td>
                  <td>{c.genero}</td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: 12 }}>{c.fechaInscripcion}</td>
                  <td>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: c.diasRestantes > 5 ? '#10b981' : c.diasRestantes > 0 ? '#f59e0b' : '#ef4444' }}>
                      {c.diasRestantes}
                    </span>
                  </td>
                  <td>
                    {c.dentro
                      ? <span className="badge-inside">En gym</span>
                      : c.diasRestantes > 0
                        ? <span className="badge-active">Activo</span>
                        : <span className="badge-inactive">Inactivo</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setModal(c)}
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Edit2 size={13} /> Editar
                      </button>
                      <button className="btn-danger" onClick={() => setConfirmDel(c)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal nuevo/editar */}
      <AnimatePresence>
        {modal && (
          <Modal
            title={modal === 'nuevo' ? 'NUEVO CLIENTE' : 'EDITAR CLIENTE'}
            onClose={() => setModal(null)}
          >
            <ClienteForm
              initial={modal === 'nuevo' ? empty : modal}
              onSave={handleGuardar}
              onCancel={() => setModal(null)}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal confirmar eliminar */}
      <AnimatePresence>
        {confirmDel && (
          <Modal title="ELIMINAR CLIENTE" onClose={() => setConfirmDel(null)}>
            <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.7 }}>
              ¿Seguro que quieres eliminar a <strong style={{ color: '#f1f5f9' }}>{confirmDel.nombres} {confirmDel.apellidos}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setConfirmDel(null)} style={{ flex: 1 }}>Cancelar</button>
              <button
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => { eliminarCliente(confirmDel.id); setConfirmDel(null) }}
              >
                Eliminar
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
