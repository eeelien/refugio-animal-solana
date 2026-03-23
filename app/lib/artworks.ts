export interface Artwork {
  id: string
  title: string
  artist: string
  artistHandle: string
  description: string
  price_sol: number
  edition: string
  emoji: string
  color: string
  available: boolean
  proceeds: string
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'enola-portrait',
    title: 'Enola — Libre',
    artist: '39eliens',
    artistHandle: '@39eliens',
    description: 'Retrato digital de Enola, la labradora que espera su hogar. Arte generativo con alma.',
    price_sol: 0.05,
    edition: '1/1',
    emoji: '🐕',
    color: 'amber',
    available: true,
    proceeds: '100% al refugio',
  },
  {
    id: 'hilary-resilience',
    title: 'Hilary — Resistencia',
    artist: '39eliens',
    artistHandle: '@39eliens',
    description: 'Hilary lleva sus cuidados especiales con dignidad. Obra dedicada a todos los que no se rinden.',
    price_sol: 0.08,
    edition: '1/1',
    emoji: '🐈',
    color: 'purple',
    available: true,
    proceeds: '100% al refugio',
  },
  {
    id: 'shelter-collective',
    title: 'El Refugio — Colectivo',
    artist: '39eliens',
    artistHandle: '@39eliens',
    description: 'Los cinco: Enola, Gidbey, Lory, Tasha e Hilary. Juntos. Una sola obra, un solo corazón.',
    price_sol: 0.15,
    edition: '1/3',
    emoji: '🐾',
    color: 'rose',
    available: true,
    proceeds: '100% al refugio',
  },
]

export const COLOR_MAP: Record<string, string> = {
  amber:  'bg-amber-50 border-amber-200 hover:border-amber-400',
  purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  rose:   'bg-rose-50 border-rose-200 hover:border-rose-400',
  orange: 'bg-orange-50 border-orange-200 hover:border-orange-400',
}

export const BADGE_MAP: Record<string, string> = {
  amber:  'bg-amber-100 text-amber-800',
  purple: 'bg-purple-100 text-purple-800',
  rose:   'bg-rose-100 text-rose-800',
  orange: 'bg-orange-100 text-orange-800',
}
