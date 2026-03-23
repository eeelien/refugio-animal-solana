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
  imageUrl?: string
}

export const ARTWORKS: Artwork[] = [
  {
    id: 'cosmica-01',
    title: 'Cósmica I — El Ojo que Todo lo Ve',
    artist: '39eliens',
    artistHandle: '@39eliens',
    description: 'Ser de otro mundo, con el ojo que registra cada vida. Arte digital original de 39eliens. 100% de lo recaudado va al refugio.',
    price_sol: 0.32,
    edition: '1/1',
    emoji: '🌌',
    color: 'purple',
    available: true,
    imageUrl: 'https://pub-79dff3b50b29432ba6d3f85b0af33331.r2.dev/refugio/39eliens-obra-01.jpg',
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
