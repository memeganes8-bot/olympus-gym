import { createContext, useContext, useState, useEffect } from 'react'

const GymContext = createContext()

const PLANES = [
  { label: '1 mes', dias: 30, valor: 90000 },
  { label: '3 meses', dias: 90, valor: 250000 },
  { label: '6 meses', dias: 180, valor: 480000 },
  { label: '1 año', dias: 365, valor: 1000000 },
]

function calcularValor(dias) {
  const plan = PLANES.find(p => p.dias === dias)
  return plan ? plan.valor : dias * 8000
}

function cargarOLimpiar(key, validador) {
  try {
    const guardado = JSON.parse(localStorage.getItem(key))
    if (!guardado || guardado.length === 0) return []
    if (!validador(guardado[0])) {
      localStorage.removeItem('olympus_clientes')
      localStorage.removeItem('olympus_pagos')
      localStorage.removeItem('olympus_movimientos')
      return []
    }
    return guardado
  } catch {
    return []
  }
}

export function GymProvider({ children }) {
  const [clientes, setClientes] = useState(() =>
    cargarOLimpiar('olympus_clientes', (c) => c.eliminado !== undefined)
  )
  const [pagos, setPagos] = useState(() =>
    cargarOLimpiar('olympus_pagos', (p) => p.clienteNombre !== undefined && p.plan !== undefined)
  )
  const [movimientos, setMovimientos] = useState(() =>
    cargarOLimpiar('olympus_movimientos', () => true)
  )

  useEffect(() => { localStorage.setItem('olympus_clientes', JSON.stringify(clientes)) }, [clientes])
  useEffect(() => { localStorage.setItem('olympus_pagos', JSON.stringify(pagos)) }, [pagos])
  useEffect(() => { localStorage.setItem('olympus_movimientos', JSON.stringify(movimientos)) }, [movimientos])

  const nextId = (arr) => arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1

  const agregarCliente = (data) => {
    const nuevo = {
      ...data,
      id: nextId(clientes),
      diasRestantes: 0,
      dentro: false,
      eliminado: false,
      fechaInscripcion: new Date().toISOString().split('T')[0]
    }
    setClientes(prev => [...prev, nuevo])
    return nuevo
  }

  const editarCliente = (id, data) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const eliminarCliente = (id) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, eliminado: true } : c))
  }

  const registrarPago = (clienteId, dias, fecha) => {
    const valor = calcularValor(dias)
    const plan = PLANES.find(p => p.dias === dias)?.label || `${dias} días`
    const cliente = clientes.find(c => c.id === clienteId)
    const clienteNombre = cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Desconocido'
    const pago = { id: nextId(pagos), clienteId, clienteNombre, fecha, dias, plan, valor }
    setPagos(prev => [...prev, pago])
    setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, diasRestantes: (c.diasRestantes || 0) + dias } : c))
    return pago
  }

  const registrarEntrada = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    if (!cliente || cliente.diasRestantes <= 0) return { ok: false, msg: 'El cliente no tiene días disponibles' }
    if (cliente.dentro) return { ok: false, msg: 'El cliente ya está dentro del gimnasio' }
    const mov = { id: nextId(movimientos), clienteId, tipo: 'entrada', fecha: new Date().toISOString() }
    setMovimientos(prev => [...prev, mov])
    setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, dentro: true, diasRestantes: c.diasRestantes - 1 } : c))
    return { ok: true }
  }

  const registrarSalida = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    if (!cliente || !cliente.dentro) return { ok: false, msg: 'El cliente no está dentro del gimnasio' }
    const mov = { id: nextId(movimientos), clienteId, tipo: 'salida', fecha: new Date().toISOString() }
    setMovimientos(prev => [...prev, mov])
    setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, dentro: false } : c))
    return { ok: true }
  }

  const clientesActivos_list = clientes.filter(c => !c.eliminado)
  const clientesDentro = clientes.filter(c => c.dentro && !c.eliminado)
  const clientesActivos = clientes.filter(c => c.diasRestantes > 0 && !c.eliminado)
  const ingresosMes = pagos
    .filter(p => p.fecha?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, p) => s + p.valor, 0)
  const ingresosTotal = pagos.reduce((s, p) => s + p.valor, 0)

  return (
    <GymContext.Provider value={{
      clientes: clientesActivos_list,
      pagos, movimientos,
      agregarCliente, editarCliente, eliminarCliente,
      registrarPago, registrarEntrada, registrarSalida,
      clientesDentro, clientesActivos, ingresosMes, ingresosTotal,
      calcularValor, PLANES,
    }}>
      {children}
    </GymContext.Provider>
  )
}

export const useGym = () => useContext(GymContext)