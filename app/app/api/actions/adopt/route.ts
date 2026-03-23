import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { DEMO_PETS, OWNER_WALLET } from '@/lib/pets'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const petId = url.searchParams.get('pet') || 'enola'
  const pet = DEMO_PETS.find(p => p.id === petId) || DEMO_PETS[0]

  return NextResponse.json({
    icon: `https://refugio-animal-solana.vercel.app/icon.png`,
    label: `Adoptar a ${pet.nombre} ${pet.emoji}`,
    title: `Refugio Animal Solana 🐾 — Adopta a ${pet.nombre}`,
    description: `${pet.descripcion} Donación de 0.01 SOL va directo al refugio para croquetas y cuidados. Programa on-chain en Solana devnet.`,
    links: {
      actions: [
        {
          label: `Adoptar a ${pet.nombre} — 0.01 SOL`,
          href: `/api/actions/adopt?pet=${petId}`,
        }
      ]
    }
  }, { headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const petId = url.searchParams.get('pet') || 'enola'
    const pet = DEMO_PETS.find(p => p.id === petId) || DEMO_PETS[0]

    const body = await req.json()
    const userPublicKey = new PublicKey(body.account)

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const shelterWallet = new PublicKey(OWNER_WALLET)
    const adoptionAmount = BigInt(Math.floor(0.01 * LAMPORTS_PER_SOL))

    const { blockhash } = await connection.getLatestBlockhash()

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: userPublicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: shelterWallet,
        lamports: adoptionAmount,
      })
    )

    const serialized = transaction.serialize({ requireAllSignatures: false })
    const base64 = Buffer.from(serialized).toString('base64')

    return NextResponse.json({
      transaction: base64,
      message: `¡Gracias por adoptar a ${pet.nombre} ${pet.emoji}! Tu donación de 0.01 SOL ayuda al refugio a comprar croquetas y medicamentos.`,
    }, { headers: CORS_HEADERS })

  } catch (error) {
    console.error('Blink error:', error)
    return NextResponse.json({ error: 'Error building transaction' }, { status: 500, headers: CORS_HEADERS })
  }
}
