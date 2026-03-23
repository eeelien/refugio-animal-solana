import { NextRequest, NextResponse } from 'next/server'
import { DEMO_PETS } from '@/lib/pets'

// ─── Estado del refugio (en producción: leer de Solana on-chain + DB) ────────

interface Pet {
  id: string; nombre: string; vivo: boolean; sano: boolean
  esterilizado: boolean; viejo: boolean; enfermo: boolean
  adoptado: boolean; mucho_tiempo_sin_adopcion: boolean
}

interface Donacion { fecha: string; donante: string; wallet: string; sol: number; motivo: string }
interface Gasto { fecha: string; categoria: string; descripcion: string; sol: number }
interface InventarioItem { cantidad: number; minimo: number; unidad: string; costo_sol_por_unidad: number }

// Mascotas on-chain (espejo del programa Anchor en devnet)
const mascotas: Pet[] = [
  { id: 'enola',  nombre: 'Enola',  vivo: true,  sano: true,  esterilizado: true,  viejo: false, enfermo: false, adoptado: false, mucho_tiempo_sin_adopcion: false },
  { id: 'gidbey', nombre: 'Gidbey', vivo: true,  sano: true,  esterilizado: false, viejo: false, enfermo: false, adoptado: false, mucho_tiempo_sin_adopcion: false },
  { id: 'lory',   nombre: 'Lory',   vivo: true,  sano: true,  esterilizado: true,  viejo: false, enfermo: false, adoptado: false, mucho_tiempo_sin_adopcion: false },
  { id: 'tasha',  nombre: 'Tasha',  vivo: true,  sano: true,  esterilizado: true,  viejo: false, enfermo: false, adoptado: false, mucho_tiempo_sin_adopcion: true  },
  { id: 'hilary', nombre: 'Hilary', vivo: true,  sano: false, esterilizado: false, viejo: true,  enfermo: true,  adoptado: false, mucho_tiempo_sin_adopcion: true  },
]

let inventario: Record<string, InventarioItem> = {
  croquetas:    { cantidad: 5,  minimo: 3,  unidad: 'kg',       costo_sol_por_unidad: 0.01 },
  medicamentos: { cantidad: 8,  minimo: 5,  unidad: 'unidades', costo_sol_por_unidad: 0.02 },
  juguetes:     { cantidad: 6,  minimo: 4,  unidad: 'unidades', costo_sol_por_unidad: 0.005 },
  vacunas:      { cantidad: 3,  minimo: 2,  unidad: 'dosis',    costo_sol_por_unidad: 0.03 },
  desparasitante:{ cantidad: 4, minimo: 2,  unidad: 'dosis',    costo_sol_por_unidad: 0.015 },
}

const donaciones: Donacion[] = [
  { fecha: '2026-03-20T10:00:00Z', donante: 'Anónimo', wallet: '7xKp...AbC1', sol: 0.01, motivo: 'Adopción Enola' },
  { fecha: '2026-03-21T14:30:00Z', donante: 'Anónimo', wallet: '9mRt...Xy5Z', sol: 0.01, motivo: 'Adopción Gidbey' },
]

const gastos: Gasto[] = [
  { fecha: '2026-03-20T09:00:00Z', categoria: 'croquetas',    descripcion: 'Croquetas mensual 10kg', sol: 0.1  },
  { fecha: '2026-03-21T11:00:00Z', categoria: 'medicamentos', descripcion: 'Medicamentos Hilary',   sol: 0.04 },
]

// ─── Funciones del agente ─────────────────────────────────────────────────────

function calcularEstadisticas() {
  const vivos              = mascotas.filter(m => m.vivo)
  const finados            = mascotas.filter(m => !m.vivo)
  const enfermos           = vivos.filter(m => m.enfermo)
  const sanos              = vivos.filter(m => m.sano && !m.enfermo)
  const jovenes            = vivos.filter(m => !m.viejo)
  const viejitos           = vivos.filter(m => m.viejo)
  const esterilizados      = vivos.filter(m => m.esterilizado)
  const sinEsterilizar     = vivos.filter(m => !m.esterilizado)
  const adoptados          = mascotas.filter(m => m.adoptado)
  const disponibles        = vivos.filter(m => !m.adoptado)
  const sinAdopcionMucho   = vivos.filter(m => m.mucho_tiempo_sin_adopcion && !m.adoptado)

  return { vivos: vivos.length, finados: finados.length, enfermos: enfermos.length,
    sanos: sanos.length, jovenes: jovenes.length, viejitos: viejitos.length,
    esterilizados: esterilizados.length, sinEsterilizar: sinEsterilizar.length,
    adoptados: adoptados.length, disponibles: disponibles.length,
    sinAdopcionMucho: sinAdopcionMucho.length,
    necesitan_atencion: [...enfermos, ...sinEsterilizar.filter(m => m.viejo)].map(m => m.nombre),
  }
}

function calcularFinanzas() {
  const total_donado = donaciones.reduce((s, d) => s + d.sol, 0)
  const total_gastado = gastos.reduce((s, g) => s + g.sol, 0)
  const balance = total_donado - total_gastado
  const costo_inventario_minimo = Object.values(inventario).reduce(
    (s, item) => s + (item.minimo * item.costo_sol_por_unidad), 0
  )
  return {
    total_donado: +total_donado.toFixed(4),
    total_gastado: +total_gastado.toFixed(4),
    balance_sol: +balance.toFixed(4),
    costo_reabastecer_minimos: +costo_inventario_minimo.toFixed(4),
    alcanza_para_reabastecer: balance >= costo_inventario_minimo,
    donantes_unicos: new Set(donaciones.map(d => d.wallet)).size,
  }
}

function calcularAlertas() {
  const alertas = []
  const stats = calcularEstadisticas()

  // Alertas de inventario
  for (const [nombre, item] of Object.entries(inventario)) {
    if (item.cantidad <= item.minimo) {
      alertas.push({
        tipo: 'STOCK_BAJO', prioridad: 'ALTA',
        mensaje: `${nombre}: ${item.cantidad} ${item.unidad} (mínimo: ${item.minimo})`,
        accion: `Comprar ${item.minimo * 2} ${item.unidad} de ${nombre} — costo aprox ${(item.minimo * 2 * item.costo_sol_por_unidad).toFixed(3)} SOL`,
        responsable_humano: true,
      })
    }
  }
  // Alertas de mascotas
  if (stats.enfermos > 0) {
    alertas.push({ tipo: 'MASCOTAS_ENFERMAS', prioridad: 'ALTA',
      mensaje: `${stats.enfermos} mascota(s) enferma(s): ${calcularEstadisticas().necesitan_atencion.join(', ')}`,
      accion: 'Revisar medicamentos. Visita veterinaria requerida.', responsable_humano: true })
  }
  if (stats.sinEsterilizar > 0) {
    alertas.push({ tipo: 'PENDIENTE_ESTERILIZACION', prioridad: 'MEDIA',
      mensaje: `${stats.sinEsterilizar} mascota(s) sin esterilizar`,
      accion: 'Agendar cita veterinaria para esterilización', responsable_humano: true })
  }
  if (stats.sinAdopcionMucho > 0) {
    alertas.push({ tipo: 'SIN_ADOPCION_MUCHO_TIEMPO', prioridad: 'MEDIA',
      mensaje: `${stats.sinAdopcionMucho} mascota(s) llevan mucho tiempo sin adoptarse`,
      accion: 'Compartir Blink de adopción en redes sociales', responsable_humano: false })
  }
  return alertas
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function GET() {
  const stats = calcularEstadisticas()
  const finanzas = calcularFinanzas()
  const alertas = calcularAlertas()

  return NextResponse.json({
    agente: 'Refugio Animal Solana — Sistema de Gestión Autónoma v1.0',
    programa_id: '56XMjeUnV1vDsEwuCVZMv5g9NNBjXxkZTfH3DyvCs351',
    red: 'devnet',
    consultado_en: new Date().toISOString(),

    estado_general: alertas.filter(a => a.prioridad === 'ALTA').length > 0
      ? '🔴 REQUIERE_ATENCION_URGENTE'
      : alertas.length > 0 ? '🟡 HAY_ALERTAS' : '🟢 TODO_OK',

    mascotas: {
      ...stats,
      lista_completa: mascotas.map(m => ({
        nombre: m.nombre,
        estado: m.vivo ? (m.adoptado ? '✅ adoptado' : m.enfermo ? '🔴 enfermo' : '🟢 disponible') : '⚫ finado',
        esterilizado: m.esterilizado ? 'sí' : 'pendiente',
        edad: m.viejo ? 'adulto mayor' : 'joven',
        blink_adopcion: m.adoptado ? null : `/api/actions/adopt?pet=${m.id}`,
      }))
    },

    inventario: Object.entries(inventario).reduce((acc, [nombre, item]) => {
      acc[nombre] = {
        ...item,
        estado: item.cantidad <= item.minimo ? '⚠️ BAJO' : '✅ OK',
      }
      return acc
    }, {} as Record<string, unknown>),

    finanzas,
    donaciones: {
      total: donaciones.length,
      historial: donaciones,
    },
    gastos: {
      total: gastos.length,
      historial: gastos,
    },

    alertas,
    acciones_autonomas_del_agente: [
      'Monitorear inventario cada hora',
      'Registrar donaciones on-chain via Blinks',
      'Detectar mascotas enfermas y alertar',
      'Generar reporte financiero automático',
      'Compartir Blinks de mascotas sin adopción',
    ],
    requiere_intervencion_humana: [
      'Surtir croquetas y medicamentos físicamente',
      'Llevar mascotas al veterinario',
      'Esterilizaciones programadas',
    ],
  })
}

export async function POST(req: NextRequest) {
  try {
    const { accion, item, cantidad, donante, wallet, sol, motivo } = await req.json()

    if (accion === 'registrar_donacion') {
      donaciones.push({ fecha: new Date().toISOString(), donante: donante || 'Anónimo', wallet: wallet || 'desconocida', sol: sol || 0.01, motivo: motivo || 'Donación general' })
      return NextResponse.json({ exito: true, mensaje: `Donación de ${sol} SOL registrada de ${donante}`, finanzas: calcularFinanzas() })
    }

    if (accion === 'reabastecer') {
      if (!inventario[item]) return NextResponse.json({ error: `Item desconocido: ${item}` }, { status: 400 })
      const costo = cantidad * inventario[item].costo_sol_por_unidad
      inventario[item].cantidad += cantidad
      gastos.push({ fecha: new Date().toISOString(), categoria: item, descripcion: `Reabastecimiento: ${cantidad} ${inventario[item].unidad} de ${item}`, sol: costo })
      return NextResponse.json({ exito: true, mensaje: `✅ ${cantidad} ${inventario[item].unidad} de ${item} reabastecidos. Costo: ${costo.toFixed(4)} SOL`, inventario_actualizado: inventario[item], alertas_activas: calcularAlertas().length })
    }

    if (accion === 'marcar_adoptado') {
      const mascota = mascotas.find(m => m.id === item)
      if (!mascota) return NextResponse.json({ error: 'Mascota no encontrada' }, { status: 404 })
      mascota.adoptado = true
      donaciones.push({ fecha: new Date().toISOString(), donante: donante || 'Adoptante', wallet: wallet || 'desconocida', sol: 0.01, motivo: `Adopción de ${mascota.nombre}` })
      return NextResponse.json({ exito: true, mensaje: `🐾 ${mascota.nombre} marcada como adoptada. ¡Encontró hogar!`, finanzas: calcularFinanzas() })
    }

    return NextResponse.json({ error: 'Acción desconocida. Usa: registrar_donacion | reabastecer | marcar_adoptado' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 })
  }
}
