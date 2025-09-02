import type { User } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    username: "alex_artist",
    email: "alex@lumora.com",
    avatar: "/artist-profile.png",
    bio: "Explorando la intersección entre arte y tecnología.",
    createdAt: new Date("2024-01-15"),
    isOnline: true,
    facets: [
      {
        id: "1",
        name: "Artista",
        description: "Portfolio, arte generativo, exhibiciones",
        avatar: "/digital-art-avatar.png",
        isActive: true,
        category: "artista",
      },
      {
        id: "2",
        name: "Profesional",
        description: "CV, logros, publicaciones",
        avatar: "/professional-avatar.png",
        isActive: false,
        category: "profesional",
      },
      {
        id: "3",
        name: "Viajero",
        description: "Crónicas, mapas, fotos",
        avatar: "/traveler-avatar.png",
        isActive: false,
        category: "viajero",
      },
    ],
    followers: ["2", "3", "4", "5", "7", "8", "9"],
    following: ["2", "3", "4", "7", "9"],
    blockedUsers: [],
    stats: {
      posts: 45,
      followers: 1234,
      following: 567,
      likes: 8901,
      views: 15678
    }
  },
  {
    id: "2",
    username: "nyla_escritora",
    email: "nyla@lumora.com",
    avatar: "/writer-profile.png",
    bio: "Narrando historias que trascienden dimensiones.",
    createdAt: new Date("2024-02-01"),
    isOnline: true,
    facets: [
      {
        id: "4",
        name: "Escritora",
        description: "Novelas, cuentos, poesía",
        avatar: "/writer-avatar.png",
        isActive: true,
        category: "escritor",
      },
    ],
    followers: ["1", "3", "5", "8", "9"],
    following: ["1", "3", "5", "9"],
    blockedUsers: [],
    stats: {
      posts: 67,
      followers: 2341,
      following: 789,
      likes: 12345,
      views: 23456
    }
  },
  {
    id: "3",
    username: "sofia_curadora",
    email: "sofia@lumora.com",
    avatar: "/curator-profile.png",
    bio: "Curadora de experiencias digitales inmersivas.",
    createdAt: new Date("2024-01-20"),
    isOnline: true,
    facets: [
      {
        id: "5",
        name: "Curadora",
        description: "Exposiciones, arte digital",
        avatar: "/curator-avatar.png",
        isActive: true,
        category: "artista",
      },
    ],
    followers: ["1", "2", "4", "5", "7"],
    following: ["1", "2", "4", "7"],
    blockedUsers: [],
    stats: {
      posts: 34,
      followers: 1567,
      following: 432,
      likes: 6789,
      views: 12345
    }
  },
  {
    id: "4",
    username: "ilan_dev",
    email: "ilan@lumora.com",
    avatar: "/developer-profile.png",
    bio: "Desarrollador Web3 construyendo el futuro descentralizado.",
    createdAt: new Date("2024-01-10"),
    isOnline: false,
    facets: [
      {
        id: "6",
        name: "Dev Web3",
        description: "Blockchain, DApps, Smart Contracts",
        avatar: "/web3-developer-avatar.png",
        isActive: true,
        category: "profesional",
      },
    ],
    followers: ["1", "3", "5"],
    following: ["1", "3"],
    blockedUsers: [],
    stats: {
      posts: 23,
      followers: 856,
      following: 234,
      likes: 5432,
      views: 9876
    }
  },
  {
    id: "5",
    username: "lia_moderadora",
    email: "lia@lumora.com",
    avatar: "/moderator-profile.png",
    bio: "Moderadora y organizadora de eventos literarios.",
    createdAt: new Date("2024-01-05"),
    isOnline: true,
    facets: [
      {
        id: "7",
        name: "Moderadora",
        description: "Gestión de comunidades",
        avatar: "/moderator-avatar.png",
        isActive: true,
        category: "profesional",
      },
    ],
    followers: ["1", "2", "3", "6"],
    following: ["1", "2", "3"],
    blockedUsers: [],
    stats: {
      posts: 12,
      followers: 567,
      following: 123,
      likes: 2345,
      views: 4567
    }
  },
  {
    id: "6",
    username: "marco_admin",
    email: "marco@lumora.com",
    avatar: "/admin-profile.png",
    bio: "Administrador de sistemas y arquitecto de la plataforma.",
    createdAt: new Date("2023-12-01"),
    isOnline: false,
    facets: [
      {
        id: "8",
        name: "Admin",
        description: "Administración de sistemas",
        avatar: "/admin-avatar.png",
        isActive: true,
        category: "profesional",
      },
    ],
    followers: ["5"],
    following: ["5"],
    blockedUsers: [],
    stats: {
      posts: 8,
      followers: 234,
      following: 45,
      likes: 1234,
      views: 2345
    }
  },
  {
    id: "7",
    username: "vera_ilustradora",
    email: "vera@lumora.com",
    avatar: "/illustrator-profile.png",
    bio: "Ilustradora especializada en mundos fantásticos.",
    createdAt: new Date("2024-02-10"),
    isOnline: true,
    facets: [
      {
        id: "9",
        name: "Ilustradora",
        description: "Ilustración digital, concept art",
        avatar: "/illustrator-avatar.png",
        isActive: true,
        category: "artista",
      },
    ],
    followers: ["1", "3", "8", "9"],
    following: ["1", "3", "8"],
    blockedUsers: [],
    stats: {
      posts: 28,
      followers: 892,
      following: 345,
      likes: 4567,
      views: 7890
    }
  },
  {
    id: "8",
    username: "tadeo_lector",
    email: "tadeo@lumora.com",
    avatar: "/reader-profile.png",
    bio: "Lector voraz de ciencia ficción y fantasía.",
    createdAt: new Date("2024-02-15"),
    isOnline: false,
    facets: [
      {
        id: "10",
        name: "Lector",
        description: "Reseñas, análisis literarios",
        avatar: "/reader-avatar.png",
        isActive: true,
        category: "escritor",
      },
    ],
    followers: ["1", "2", "7", "9"],
    following: ["1", "2", "7"],
    blockedUsers: [],
    stats: {
      posts: 15,
      followers: 445,
      following: 234,
      likes: 2345,
      views: 3456
    }
  },
  {
    id: "9",
    username: "ana_editora",
    email: "ana@lumora.com",
    avatar: "/editor-profile.png",
    bio: "Editora especializada en narrativa especulativa.",
    createdAt: new Date("2024-01-25"),
    isOnline: true,
    facets: [
      {
        id: "11",
        name: "Editora",
        description: "Edición, corrección, publicación",
        avatar: "/editor-avatar.png",
        isActive: true,
        category: "profesional",
      },
    ],
    followers: ["1", "2", "7", "8"],
    following: ["1", "2", "7", "8"],
    blockedUsers: [],
    stats: {
      posts: 19,
      followers: 678,
      following: 456,
      likes: 3456,
      views: 5678
    }
  },
]

export const users = mockUsers

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}

export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find((user) => user.username === username)
}
