export interface Pet {
  id: string
  nombre: string
  edad: number
  especie: string
  emoji: string
  enfermo: boolean
  adoptado: boolean
  descripcion: string
  color: string
  imageUrl?: string
}

export const DEMO_PETS: Pet[] = [
  {
    id: 'enola',
    nombre: 'Enola',
    edad: 2,
    especie: 'Perra',
    emoji: '🐕',
    enfermo: false,
    adoptado: false,
    descripcion: 'Labrador juguetona y llena de energía. Le encanta correr y dar besos.',
    color: 'amber',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 'gidbey',
    nombre: 'Gidbey',
    edad: 4,
    especie: 'Perro',
    emoji: '🐶',
    enfermo: false,
    adoptado: false,
    descripcion: 'Pastor leal y protector. Ideal para familias con niños.',
    color: 'orange',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 'lory',
    nombre: 'Lory',
    edad: 1,
    especie: 'Gata',
    emoji: '🐱',
    enfermo: false,
    adoptado: false,
    descripcion: 'Gatita curiosa y traviesa. Muy cariñosa una vez que te conoce.',
    color: 'yellow',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 'tasha',
    nombre: 'Tasha',
    edad: 3,
    especie: 'Perra',
    emoji: '🐩',
    enfermo: false,
    adoptado: false,
    descripcion: 'Pequeña y elegante. Perfecta para departamentos, tranquila y amorosa.',
    color: 'rose',
    imageUrl: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 'hilary',
    nombre: 'Hilary',
    edad: 6,
    especie: 'Gata',
    emoji: '🐈',
    enfermo: true,
    adoptado: false,
    descripcion: 'Necesita cuidados especiales, pero tiene el corazón más grande del refugio.',
    color: 'purple',
    imageUrl: 'https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=400&h=400&fit=crop&auto=format',
  },
]

export const PROGRAM_ID = '56XMjeUnV1vDsEwuCVZMv5g9NNBjXxkZTfH3DyvCs351'
export const OWNER_WALLET = 'GNfxdeQAxwM7PUL5oFE7Jpr5GnmD4H5VmEfWbLdXxfW5'
export const NETWORK = 'devnet'
