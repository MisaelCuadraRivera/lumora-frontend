import type { Message } from "@/types"

export const mockMessages: Message[] = [
  {
    id: "1",
    channelId: "general",
    authorId: "2",
    author: {
      id: "2",
      name: "Nyla",
      avatar: "/writer-profile.png",
      role: "Escritora",
    },
    content:
      "¿Alguien más piensa que el @Mulo — Historiador tiene razón sobre la cronología en Hyperion? La relación entre los Templarios y los Technocores me voló la mente.",
    reactions: [
      { emoji: "✨", count: 5 },
      { emoji: "🚀", count: 3 },
      { emoji: "👍", count: 2 },
    ],
    createdAt: new Date("2024-03-15T18:04:00"),
  },
  {
    id: "2",
    channelId: "general",
    authorId: "3",
    author: {
      id: "3",
      name: "Sofia",
      avatar: "/curator-profile.png",
      role: "Curadora",
    },
    content: "Comparto esta ilustración del Alcaudón que encontré, ¿qué opinan? @Nyla creo que te va a gustar.",
    attachment: {
      name: "Ilustracion fan-art — Alcaudón",
      url: "/placeholder.svg?height=400&width=600",
      type: "image",
    },
    reactions: [
      { emoji: "✨", count: 12 },
      { emoji: "💜", count: 7 },
    ],
    createdAt: new Date("2024-03-15T18:06:00"),
  },
  {
    id: "3",
    channelId: "general",
    authorId: "4",
    author: {
      id: "4",
      name: "Ilan",
      avatar: "/developer-profile.png",
      role: "Dev Web3",
    },
    content:
      "Pequeña teoría: la inteligencia distribuida de los Technocores se parece a las identidades multiperfil de Lumora. Cambias de nodo/faceta según contexto.",
    reactions: [
      { emoji: "👍", count: 9 },
      { emoji: "🤯", count: 4 },
    ],
    createdAt: new Date("2024-03-15T18:09:00"),
  },
  {
    id: "4",
    channelId: "general",
    authorId: "5",
    author: {
      id: "5",
      name: "Lia",
      avatar: "/moderator-profile.png",
      role: "Moderadora",
    },
    content:
      "@Ilan — Dev Web3 me encanta esa lectura. Recordatorio: mañana en #discusión-hyperion haremos un deep dive sin spoilers del Libro 2.",
    reactions: [{ emoji: "❌", count: 1 }],
    createdAt: new Date("2024-03-15T18:12:00"),
    replyTo: "3",
  },
]

export const messages = mockMessages

export const getMessagesByChannel = (channelId: string): Message[] => {
  return mockMessages
    .filter((message) => message.channelId === channelId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export const getMessageById = (id: string): Message | undefined => {
  return mockMessages.find((message) => message.id === id)
}
