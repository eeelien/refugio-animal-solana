'use client'
import { useState } from 'react'
import { DEMO_PETS, PROGRAM_ID, NETWORK } from '@/lib/pets'

const colorMap: Record<string, string> = {
  amber: 'bg-amber-50 border-amber-200 hover:border-amber-400',
  orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
  rose: 'bg-rose-50 border-rose-200 hover:border-rose-400',
  purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
}

const badgeMap: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800',
  orange: 'bg-orange-100 text-orange-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  rose: 'bg-rose-100 text-rose-800',
  purple: 'bg-purple-100 text-purple-800',
}

export default function Home() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [agentData, setAgentData] = useState<Record<string, unknown> | null>(null)
  const [loadingAgent, setLoadingAgent] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://refugio-animal-solana.vercel.app'

  const copyBlink = (petId: string) => {
    const link = `${baseUrl}/api/actions/adopt?pet=${petId}`
    navigator.clipboard.writeText(link)
    setCopiedId(petId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const checkAgent = async () => {
    setLoadingAgent(true)
    try {
      const res = await fetch('/api/agent')
      const data = await res.json()
      setAgentData(data)
    } catch {
      setAgentData({ error: 'No se pudo conectar con el agente' })
    } finally {
      setLoadingAgent(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero */}
      <section className="px-4 py-16 text-center max-w-3xl mx-auto">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Refugio Animal Solana</h1>
        <p className="text-lg text-gray-600 mb-2">Adopta mascotas y dona con un click — powered by Solana Blinks</p>
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">✅ Devnet Live</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">⚡ Blinks Ready</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">🤖 AI Agent</span>
        </div>
        <p className="text-xs text-gray-400 mt-3">Program: {PROGRAM_ID} ({NETWORK})</p>
      </section>

      {/* Pets Grid */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mascotas en adopción</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_PETS.map(pet => (
            <div key={pet.id} className={`rounded-2xl border-2 p-5 transition-all duration-200 ${colorMap[pet.color]}`}>
              <div className="text-5xl mb-3 text-center">{pet.emoji}</div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-gray-800">{pet.nombre}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeMap[pet.color]}`}>
                  {pet.especie}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{pet.edad} {pet.edad === 1 ? 'año' : 'años'}</p>
              {pet.enfermo && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full mb-2 inline-block">
                  💊 Necesita cuidados
                </span>
              )}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pet.descripcion}</p>

              <div className="space-y-2">
                <a
                  href={`solana-action:${baseUrl}/api/actions/adopt?pet=${pet.id}`}
                  className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
                >
                  Adoptar — 0.01 SOL
                </a>
                <button
                  onClick={() => copyBlink(pet.id)}
                  className="block w-full text-center bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                >
                  {copiedId === pet.id ? '✅ Link copiado!' : '🔗 Copiar Blink'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Blinks Work */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">¿Cómo funcionan los Blinks? ⚡</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🔗', title: 'Comparte el link', desc: 'Copia el Blink de cualquier mascota y compártelo en Twitter, WhatsApp o donde quieras.' },
              { icon: '👛', title: 'Conecta tu wallet', desc: 'Cualquier persona hace click, conecta su wallet de Solana y confirma en segundos.' },
              { icon: '🐾', title: 'Adopción completa', desc: 'La donación de 0.01 SOL llega directo al refugio. La transacción queda en devnet.' },
            ].map(step => (
              <div key={step.title} className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent Dashboard */}
      <section className="px-4 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Agente Autónomo 🤖</h2>
        <p className="text-center text-gray-500 text-sm mb-6">El agente monitorea el inventario del refugio y detecta cuándo necesitamos más croquetas.</p>

        <button
          onClick={checkAgent}
          disabled={loadingAgent}
          className="block mx-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors mb-6 disabled:opacity-50"
        >
          {loadingAgent ? 'Consultando agente...' : '🔍 Ver estado del agente'}
        </button>

        {agentData && (
          <div className="bg-gray-900 text-green-400 rounded-2xl p-5 font-mono text-sm overflow-x-auto">
            <pre>{JSON.stringify(agentData, null, 2)}</pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 font-mono mb-1">Llama al agente directo:</p>
          <code className="text-xs text-gray-700 break-all">
            curl {baseUrl}/api/agent
          </code>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t">
        <p>Refugio Animal Solana — WayLearn × Solana Foundation Hackathon 2026</p>
        <p className="mt-1">Built with Anchor + Next.js + Solana Blinks on devnet</p>
      </footer>
    </main>
  )
}
