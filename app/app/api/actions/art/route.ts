import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { ARTWORKS } from "@/lib/artworks"
import { OWNER_WALLET as SHELTER } from '@/lib/pets'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Accept-Action-Version, X-Accept-Blockchain-Ids',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id') || 'enola-portrait'
  const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]

  return NextResponse.json({
    icon: `https://refugio-animal-solana.vercel.app/icon.png`,
    label: `Comprar obra — ${art.price_sol} SOL`,
    title: `🎨 ${art.title} — Arte NFT para el Refugio`,
    description: `${art.description}\n\nPrecio: ${art.price_sol} SOL | Edición: ${art.edition}\n${art.proceeds} para cuidar a Enola, Gidbey, Lory, Tasha e Hilary.\n\nArtista: ${art.artistHandle}`,
    links: {
      actions: [
        { label: `Comprar "${art.title}" — ${art.price_sol} SOL`, href: `/api/actions/art?id=${id}` }
      ]
    }
  }, { headers: CORS })
}

export async function POST(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get('id') || 'enola-portrait'
    const art = ARTWORKS.find(a => a.id === id) || ARTWORKS[0]

    const body = await req.json()
    const buyer = new PublicKey(body.account)
    const shelter = new PublicKey(SHELTER)

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const { blockhash } = await connection.getLatestBlockhash()

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyer,
    }).add(
      SystemProgram.transfer({
        fromPubkey: buyer,
        toPubkey: shelter,
        lamports: BigInt(Math.floor(art.price_sol * LAMPORTS_PER_SOL)),
      })
    )

    const base64 = Buffer.from(tx.serialize({ requireAllSignatures: false })).toString('base64')

    return NextResponse.json({
      transaction: base64,
      message: `🎨 ¡Gracias por apoyar el refugio! Compraste "${art.title}" de ${art.artistHandle}. Tu NFT certificate se emitirá a tu wallet. ${art.proceeds}.`,
    }, { headers: CORS })

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS })
  }
}
