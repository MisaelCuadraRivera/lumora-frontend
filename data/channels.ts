import type { Channel } from "@/types"

export const channels: Channel[] = [
  {
    id: "general",
    name: "general",
    description: "Conversaciones y temas varios sobre el universo sci-fi",
    type: "text",
    spaceId: "cosmolectores",
    unreadCount: 128,
  },
  {
    id: "anuncios",
    name: "anuncios",
    description: "Anuncios importantes del espacio",
    type: "text",
    spaceId: "cosmolectores",
    unreadCount: 4,
  },
  {
    id: "discusion-hyperion",
    name: "discusión-hyperion",
    description: "Debate sobre la saga de Hyperion",
    type: "text",
    spaceId: "cosmolectores",
    unreadCount: 36,
  },
  {
    id: "spoilers-abiertos",
    name: "spoilers-abiertos",
    description: "Discusiones con spoilers permitidos",
    type: "text",
    spaceId: "cosmolectores",
    unreadCount: 12,
  },
  {
    id: "sala-lectura",
    name: "Sala de Lectura",
    description: "Canal de voz para lectura compartida",
    type: "voice",
    spaceId: "cosmolectores",
    connectedUsers: 0,
  },
  {
    id: "debate-semanal",
    name: "Debate Semanal",
    description: "Debates semanales en vivo",
    type: "voice",
    spaceId: "cosmolectores",
    connectedUsers: 0,
  },
]

export const mockChannels = channels

export const getChannelsBySpace = (spaceId: string): Channel[] => {
  return channels.filter((channel) => channel.spaceId === spaceId)
}

export const getChannelById = (id: string): Channel | undefined => {
  return channels.find((channel) => channel.id === id)
}
