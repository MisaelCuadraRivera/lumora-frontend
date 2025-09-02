import type { Post, Comment } from "@/types"
import { mockUsers } from "./users"

export const mockComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    authorId: "3",
    author: mockUsers[2], // sofia_curadora
    content:
      "Comparto esta ilustración del Alcaudón que encontré, ¿qué opinan? @nyla_escritora creo que te va a gustar.",
    likes: 12,
    createdAt: new Date("2024-03-15T18:06:00"),
  },
  {
    id: "2",
    postId: "3",
    authorId: "5",
    author: mockUsers[4], // lia_moderadora
    content:
      "@ilan_dev me encanta esa lectura. Recordatorio: mañana en #discusión-hyperion haremos un deep dive sin spoilers del Libro 2.",
    likes: 1,
    createdAt: new Date("2024-03-15T18:12:00"),
  },
]

export const mockPosts: Post[] = [
  {
    id: "1",
    authorId: "2",
    author: mockUsers[1], // nyla_escritora
    facetId: "4",
    facet: mockUsers[1].facets[0],
    content:
      "¿Alguien más piensa que el @mulo — Historiador tiene razón sobre la cronología en Hyperion? La relación entre los Templarios y los Technocores me voló la mente. 🧠",
    images: [],
    links: [],
    tags: ["hyperion", "ciencia-ficción", "templarios", "technocores"],
    likes: 5,
    shares: 3,
    comments: [],
    createdAt: new Date("2024-03-15T18:04:00"),
    updatedAt: new Date("2024-03-15T18:04:00"),
    spaceId: "1",
  },
  {
    id: "2",
    authorId: "3",
    author: mockUsers[2], // sofia_curadora
    facetId: "5",
    facet: mockUsers[2].facets[0],
    content:
      "Comparto esta ilustración del Alcaudón que encontré, ¿qué opinan? @nyla_escritora creo que te va a gustar.",
    images: ["/placeholder.svg?height=400&width=600"],
    links: [],
    tags: ["alcaudón", "hyperion", "fan-art", "ilustración"],
    likes: 12,
    shares: 7,
    comments: [mockComments[0]],
    createdAt: new Date("2024-03-15T18:06:00"),
    updatedAt: new Date("2024-03-15T18:06:00"),
    spaceId: "1",
  },
  {
    id: "3",
    authorId: "4",
    author: mockUsers[3], // ilan_dev
    facetId: "6",
    facet: mockUsers[3].facets[0],
    content:
      "Pequeña teoría: la inteligencia distribuida de los Technocores se parece a las identidades multiperfil de Lumora. Cambias de nodo/faceta según contexto. 🔄",
    images: [],
    links: [],
    tags: ["technocores", "teoría", "lumora", "identidad-múltiple"],
    likes: 9,
    shares: 4,
    comments: [mockComments[1]],
    createdAt: new Date("2024-03-15T18:09:00"),
    updatedAt: new Date("2024-03-15T18:09:00"),
    spaceId: "1",
  },
  {
    id: "4",
    authorId: "1",
    author: mockUsers[0], // alex_artist
    facetId: "1",
    facet: mockUsers[0].facets[0],
    content:
      'Nuevo proyecto: Serie "Nebulae 02" - Explorando texturas generativas con luz y ruido. El proceso creativo nunca deja de sorprenderme.',
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    links: [],
    tags: ["arte-generativo", "nebulae", "texturas", "proceso-creativo"],
    likes: 28,
    shares: 15,
    comments: [],
    createdAt: new Date("2024-03-15T16:30:00"),
    updatedAt: new Date("2024-03-15T16:30:00"),
  },
  {
    id: "5",
    authorId: "1",
    author: mockUsers[0], // alex_artist
    facetId: "1",
    facet: mockUsers[0].facets[0],
    content: "Cómo diseño con luz y ruido: Un proceso para crear texturas generativas con identidad propia.",
    images: ["/placeholder.svg?height=300&width=500"],
    links: ["https://blog.alex-artist.com/luz-y-ruido"],
    tags: ["tutorial", "diseño", "luz", "ruido", "proceso"],
    likes: 45,
    shares: 22,
    comments: [],
    createdAt: new Date("2024-03-15T14:20:00"),
    updatedAt: new Date("2024-03-15T14:20:00"),
  },
  {
    id: "6",
    authorId: "1",
    author: mockUsers[0], // alex_artist
    facetId: "1",
    facet: mockUsers[0].facets[0],
    content: "Bocetos para un atlas de nebulosas: Notas rápidas y referencias para una nueva serie.",
    images: ["/placeholder.svg?height=350&width=500"],
    links: [],
    tags: ["bocetos", "atlas", "nebulosas", "referencias"],
    likes: 18,
    shares: 8,
    comments: [],
    createdAt: new Date("2024-03-15T12:15:00"),
    updatedAt: new Date("2024-03-15T12:15:00"),
  },
  {
    id: "7",
    authorId: "1",
    author: mockUsers[0], // alex_artist
    facetId: "1",
    facet: mockUsers[0].facets[0],
    content: "Interfaces que respiran: Explorando microflows y ritmos en UI visuales.",
    images: ["/placeholder.svg?height=300&width=600"],
    links: [],
    tags: ["interfaces", "ui", "microflows", "ritmos", "visuales"],
    likes: 33,
    shares: 19,
    comments: [],
    createdAt: new Date("2024-03-15T10:45:00"),
    updatedAt: new Date("2024-03-15T10:45:00"),
  },
]

export const posts = mockPosts

export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find((post) => post.id === id)
}

export const getPostsByAuthor = (authorId: string): Post[] => {
  return mockPosts.filter((post) => post.authorId === authorId)
}

export const getPostsBySpace = (spaceId: string): Post[] => {
  return mockPosts.filter((post) => post.spaceId === spaceId)
}

export const getFeedPosts = (): Post[] => {
  return mockPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
