import type { Space } from "@/types"

export const mockSpaces: Space[] = [
  {
    id: "1",
    name: "Cosmolectores",
    description: "Una comunidad para explorar los confines de la imaginación a través de la ciencia ficción.",
    image: "/space-reading-community.png",
    banner: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CcxKe1uUz7DGgHlDN9v5wxp2wd6Uqj.png",
    memberCount: 1284,
    activeMembers: 73,
    category: "Literatura",
    tags: ["ciencia-ficción", "fantasía", "lectura", "discusión"],
    isJoined: true,
    createdAt: new Date("2023-11-01"),
    channels: [
      {
        id: "1",
        spaceId: "1",
        name: "general",
        description: "Conversaciones y temas varios sobre el universo sci-fi",
        type: "text",
        memberCount: 128,
      },
      {
        id: "2",
        spaceId: "1",
        name: "anuncios",
        description: "Anuncios oficiales del club",
        type: "text",
        memberCount: 4,
      },
      {
        id: "3",
        spaceId: "1",
        name: "discusión-hyperion",
        description: "Debate sobre la saga Hyperion",
        type: "text",
        memberCount: 36,
      },
      {
        id: "4",
        spaceId: "1",
        name: "spoilers-abiertos",
        description: "Discusiones con spoilers permitidos",
        type: "text",
        memberCount: 12,
      },
      {
        id: "5",
        spaceId: "1",
        name: "Sala de Lectura",
        description: "Sesiones de lectura en voz alta",
        type: "voice",
      },
      {
        id: "6",
        spaceId: "1",
        name: "Debate Semanal",
        description: "Debates semanales sobre libros",
        type: "voice",
      },
    ],
  },
  {
    id: "2",
    name: "Arte Digital Futurista",
    description: "Explorando nuevas fronteras del arte digital y la creatividad algorítmica.",
    image: "/digital-art-community.png",
    banner: "/futuristic-digital-art-banner.png",
    memberCount: 892,
    activeMembers: 45,
    category: "Arte",
    tags: ["arte-digital", "ia", "generativo", "nft"],
    isJoined: false,
    createdAt: new Date("2023-12-15"),
    channels: [
      {
        id: "7",
        spaceId: "2",
        name: "general",
        type: "text",
      },
      {
        id: "8",
        spaceId: "2",
        name: "showcase",
        type: "text",
      },
    ],
  },
  {
    id: "3",
    name: "Viajeros Dimensionales",
    description: "Compartiendo experiencias de viaje y explorando culturas a través del multiverso.",
    image: "/dimensional-travel-community.png",
    banner: "/interdimensional-travel-banner.png",
    memberCount: 567,
    activeMembers: 28,
    category: "Viajes",
    tags: ["viajes", "culturas", "fotografía", "aventura"],
    isJoined: true,
    createdAt: new Date("2024-01-10"),
    channels: [
      {
        id: "9",
        spaceId: "3",
        name: "general",
        type: "text",
      },
    ],
  },
  {
    id: "4",
    name: "Desarrolladores Web3",
    description: "Construyendo el futuro descentralizado, un bloque a la vez.",
    image: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=300&width=800",
    memberCount: 1456,
    activeMembers: 89,
    category: "Tecnología",
    tags: ["blockchain", "web3", "defi", "smart-contracts"],
    isJoined: false,
    createdAt: new Date("2023-10-20"),
    channels: [
      {
        id: "10",
        spaceId: "4",
        name: "general",
        type: "text",
      },
    ],
  },
  {
    id: "5",
    name: "Música Sintética",
    description: "Explorando los límites de la composición musical asistida por IA.",
    image: "/placeholder.svg?height=200&width=200",
    banner: "/placeholder.svg?height=300&width=800",
    memberCount: 734,
    activeMembers: 52,
    category: "Música",
    tags: ["música", "ia", "composición", "experimental"],
    isJoined: true,
    createdAt: new Date("2024-01-05"),
    channels: [
      {
        id: "11",
        spaceId: "5",
        name: "general",
        type: "text",
      },
    ],
  },
]

export const spaces = mockSpaces

export const getSpaceById = (id: string): Space | undefined => {
  return mockSpaces.find((space) => space.id === id)
}

export const getJoinedSpaces = (): Space[] => {
  return mockSpaces.filter((space) => space.isJoined)
}

export const getSpacesByCategory = (category: string): Space[] => {
  return mockSpaces.filter((space) => space.category === category)
}
