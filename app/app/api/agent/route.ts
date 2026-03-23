import { NextRequest, NextResponse } from 'next/server'

interface InventoryItem { cantidad: number; minimo: number; unidad: string }
interface Inventory { [key: string]: InventoryItem }
interface Expense { fecha: string; item: string; cantidad: number; costo_sol: number; motivo: string }

// In-memory state (resets on cold start — use DB in production)
let inventory: Inventory = {
  croquetas: { cantidad: 5, minimo: 3, unidad: 'kg' },
  medicamentos: { cantidad: 8, minimo: 5, unidad: 'unidades' },
  juguetes: { cantidad: 6, minimo: 4, unidad: 'unidades' },
  vacunas: { cantidad: 3, minimo: 2, unidad: 'dosis' },
}

const gastos: Expense[] = []

function getAlerts() {
  return Object.entries(inventory)
    .filter(([, v]) => v.cantidad <= v.minimo)
    .map(([nombre, v]) => ({
      tipo: 'STOCK_BAJO',
      item: nombre,
      actual: v.cantidad,
      minimo: v.minimo,
      unidad: v.unidad,
      accion_sugerida: `Comprar ${v.minimo * 2} ${v.unidad} de ${nombre}`,
    }))
}

export async function GET() {
  const alertas = getAlerts()

  return NextResponse.json({
    agente: 'Refugio Animal Solana — Agente de Gestión',
    version: '1.0',
    estado: alertas.length > 0 ? 'REQUIERE_ATENCION' : 'OK',
    programa_id: '56XMjeUnV1vDsEwuCVZMv5g9NNBjXxkZTfH3DyvCs351',
    red: 'devnet',
    inventario: inventory,
    alertas,
    ultimos_gastos: gastos.slice(-10),
    blinks_adopcion: {
      enola: '/api/actions/adopt?pet=enola',
      gidbey: '/api/actions/adopt?pet=gidbey',
      lory: '/api/actions/adopt?pet=lory',
      tasha: '/api/actions/adopt?pet=tasha',
      hilary: '/api/actions/adopt?pet=hilary',
    },
    wallet_refugio: 'GNfxdeQAxwM7PUL5oFE7Jpr5GnmD4H5VmEfWbLdXxfW5',
    consultado_en: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { accion, item, cantidad, motivo } = await req.json()

    if (accion === 'reabastecer') {
      if (!inventory[item]) {
        return NextResponse.json({ error: `Item desconocido: ${item}` }, { status: 400 })
      }
      const costo = cantidad * 0.005
      inventory[item].cantidad += cantidad
      gastos.push({
        fecha: new Date().toISOString(),
        item,
        cantidad,
        costo_sol: costo,
        motivo: motivo || 'Reabastecimiento automático',
      })
      return NextResponse.json({
        exito: true,
        mensaje: `Agente reabastecío ${cantidad} ${inventory[item].unidad} de ${item}. Costo: ${costo} SOL`,
        inventario_actualizado: inventory,
        alerta_limpia: !getAlerts().find(a => a.item === item),
      })
    }

    if (accion === 'consumir') {
      if (!inventory[item]) {
        return NextResponse.json({ error: `Item desconocido: ${item}` }, { status: 400 })
      }
      inventory[item].cantidad = Math.max(0, inventory[item].cantidad - cantidad)
      const alertas = getAlerts()
      return NextResponse.json({
        exito: true,
        inventario_actualizado: inventory,
        nuevas_alertas: alertas.filter(a => a.item === item),
      })
    }

    return NextResponse.json({ error: 'Acción desconocida. Usa: reabastecer | consumir' }, { status: 400 })

  } catch {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 })
  }
}
