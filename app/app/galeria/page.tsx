'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ARTWORKS, COLOR_MAP, BADGE_MAP } from '@/lib/artworks'

export default function Galeria() {
  const [copied, setCopied] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [raised] = useState(0.23) // demo: SOL raised so far

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://refugio-animal-solana.vercel.app'

  const copyBlink = (id: string) => {
    navigator.clipboard.writeText(`${baseUrl}/api/actions/art?id=${id}`)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <nav className="px-6 py-4 flex items-center justify-between border-b bg-white/80 backdrop-blur">
        <Link href="/" className="font-bold text-gray-800 flex items-center gap-2">
          <img src="/paw-pixel.svg" alt="paw" className="w-7 h-7" style={{imageRendering:'pixelated'}} />
          Refugio Animal Solana
        </Link>
        <span className="text-sm text-purple-600 font-medium">🎨 Galería NFT</span>
      </nav>

      {/* Hero */}
      <section className="px-4 py-14 text-center max-w-2xl mx-auto">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Arte que salva vidas</h1>
        <p className="text-gray-600 mb-6">
          Compra una obra NFT de artistas que apoyan el refugio.<br />
          <strong>100% de las ganancias</strong> van directo a croquetas, medicamentos y cuidados.
        </p>

        {/* Fundraising bar */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100 max-w-sm mx-auto mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Recaudado</span>
            <span className="font-bold text-purple-700">{raised} SOL</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-1">
            <div className="bg-purple-500 h-3 rounded-full transition-all" style={{ width: `${Math.min(100, (raised / 1) * 100)}%` }} />
          </div>
          <p className="text-xs text-gray-400">Meta: 1 SOL para cubrir el mes completo</p>
        </div>
      </section>

      {/* Artworks */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Obras disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTWORKS.map(art => (
            <div key={art.id} className={`rounded-2xl border-2 p-5 transition-all ${COLOR_MAP[art.color]}`}>
              {/* Artwork */}
              {art.imageUrl ? (
                <img src={art.imageUrl} alt={art.title}
                  className="w-full aspect-square rounded-xl mb-4 object-cover" />
              ) : (
                <div className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-8xl"
                  style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {art.emoji}
                </div>
              )}
              <div className="flex items-start justify-between mb-1 gap-2">
                <h3 className="font-bold text-gray-800 text-base leading-tight">{art.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${BADGE_MAP[art.color]}`}>
                  {art.edition}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{art.artistHandle}</p>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{art.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg text-gray-800">{art.price_sol} SOL</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{art.proceeds}</span>
              </div>
              <div className="space-y-2">
                <a href={`solana-action:${baseUrl}/api/actions/art?id=${art.id}`}
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm">
                  Comprar NFT — {art.price_sol} SOL
                </a>
                <button onClick={() => copyBlink(art.id)}
                  className="block w-full text-center bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-2 px-4 rounded-xl text-sm transition-colors">
                  {copied === art.id ? '✅ Link copiado!' : '🔗 Compartir Blink'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artist CTA */}
      <section className="px-4 py-12 bg-white border-t">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">¿Eres artista?</h2>
          <p className="text-gray-600 mb-6">
            Dona una obra digital, la vendemos como NFT en Solana y los fondos van al refugio.
            Tu arte aparece aquí con tu nombre, handle y Blink compartible.
            Inversores, coleccionistas y amantes de los animales lo compran.
          </p>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
            {showForm ? 'Cerrar' : '✋ Quiero participar como artista'}
          </button>

          {showForm && (
            <div className="mt-6 p-6 bg-purple-50 rounded-2xl border border-purple-100 text-left">
              <h3 className="font-bold text-gray-800 mb-3">¿Cómo participar?</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="font-bold text-purple-600">1.</span> Envía tu obra digital (JPG/PNG/GIF) por este canal</li>
                <li className="flex gap-2"><span className="font-bold text-purple-600">2.</span> Dinos el título, precio sugerido en SOL y una descripción breve</li>
                <li className="flex gap-2"><span className="font-bold text-purple-600">3.</span> La publicamos aquí en 24h con tu Blink compartible</li>
                <li className="flex gap-2"><span className="font-bold text-purple-600">4.</span> 100% de lo recaudado va al refugio — tú recibas crédito como artista y visibilidad</li>
              </ol>
              <div className="mt-4 p-3 bg-white rounded-xl border text-center">
                <p className="text-sm text-gray-500 mb-1">Contacto:</p>
                <p className="font-mono text-sm text-purple-700">@39eliens</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why NFTs */}
      <section className="px-4 py-12 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">¿Por qué NFTs?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🔗', title: 'Transparencia total', desc: 'Cada donación queda registrada en Solana devnet. Nadie puede tocar los fondos sin dejar rastro.' },
              { icon: '🎨', title: 'Arte con propósito', desc: 'No es solo una donación — recibes una obra de arte digital única que puedes coleccionar o revender.' },
              { icon: '🐾', title: 'Impacto directo', desc: 'Los fondos van directo a la wallet del refugio. El agente reporta en qué se gastó cada SOL.' },
            ].map(c => (
              <div key={c.title} className="p-4 bg-white rounded-2xl border border-purple-100 text-center">
                <div className="text-3xl mb-2">{c.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">{c.title}</h3>
                <p className="text-xs text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-400 border-t">
        <Link href="/" className="text-purple-500 hover:underline">← Volver al refugio</Link>
        <p className="mt-1">Arte en Solana devnet · Refugio Animal Solana × WayLearn 2026</p>
      </footer>
    </main>
  )
}
