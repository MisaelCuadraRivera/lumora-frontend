import { mockUsers, users, getUserById, getUserByUsername } from "./users"
import { mockSpaces, spaces, getSpaceById, getJoinedSpaces } from "./spaces"
import { mockPosts, posts, getPostById, getFeedPosts } from "./posts"
import { mockMessages, messages, getMessagesByChannel } from "./messages"
import { mockNotifications, notifications, getUnreadNotifications } from "./notifications"
import { mockChannels, channels, getChannelsBySpace, getChannelById } from "./channels"
import { mockReports, getReportsByStatus, getReportsByReporter, getReportsByModerator } from "./reports"
import { 
  mockProducts, 
  productCategories, 
  mockOrders, 
  mockReviews, 
  mockCart,
  getProductsBySpace,
  getProductsBySeller,
  getProductsByCategory,
  getProductById,
  getOrdersByUser,
  getReviewsByProduct,
  getCartByUser
} from "./marketplace"
import { 
  mockEvents,
  eventCategories,
  mockTickets,
  mockEventAttendees,
  mockEventStreams,
  mockEventChat,
  mockEventAnalytics,
  getEventsBySpace,
  getEventsByOrganizer,
  getEventsByCategory,
  getEventById,
  getTicketsByEvent,
  getAttendeesByEvent,
  getUpcomingEvents,
  getLiveEvents,
  getEventAnalytics
} from "./events"
import type { VoiceChannel, VideoCall, ChatRole, ChatNotification, Message, ChatSearchResult } from "@/types"

// Re-export all data
export {
  mockUsers,
  users,
  getUserById,
  getUserByUsername,
  mockSpaces,
  spaces,
  getSpaceById,
  getJoinedSpaces, // Added missing getJoinedSpaces export
  mockPosts,
  posts,
  getPostById,
  getFeedPosts, // Added missing getFeedPosts export
  mockMessages,
  messages,
  getMessagesByChannel,
  mockNotifications,
  notifications,
  getUnreadNotifications, // Added missing getUnreadNotifications export
  mockChannels,
  channels,
  getChannelsBySpace,
  getChannelById,
  mockReports,
  getReportsByStatus,
  getReportsByReporter,
  getReportsByModerator,
  // Marketplace exports
  mockProducts,
  productCategories,
  mockOrders,
  mockReviews,
  mockCart,
  getProductsBySpace,
  getProductsBySeller,
  getProductsByCategory,
  getProductById,
  getOrdersByUser,
  getReviewsByProduct,
  getCartByUser,
  // Events exports
  mockEvents,
  eventCategories,
  mockTickets,
  mockEventAttendees,
  mockEventStreams,
  mockEventChat,
  mockEventAnalytics,
  getEventsBySpace,
  getEventsByOrganizer,
  getEventsByCategory,
  getEventById,
  getTicketsByEvent,
  getAttendeesByEvent,
  getUpcomingEvents,
  getLiveEvents,
  getEventAnalytics,
}

// Utility functions for data manipulation
export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "ahora"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `hace ${minutes} min`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `hace ${hours}h`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `hace ${days}d`
  } else {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// CHAT ENHANCED DATA
export const voiceChannels: VoiceChannel[] = [
  {
    id: "voice-general",
    spaceId: "space-1",
    name: "🎤 General",
    description: "Canal de voz general",
    connectedUsers: [
      {
        id: "user-1",
        name: "Alex",
        avatar: "/admin-avatar.png",
        isMuted: false,
        isDeafened: false,
        isSpeaking: true,
        joinedAt: new Date(Date.now() - 300000)
      },
      {
        id: "user-2",
        name: "Sarah",
        avatar: "/curator-avatar.png",
        isMuted: true,
        isDeafened: false,
        isSpeaking: false,
        joinedAt: new Date(Date.now() - 600000)
      }
    ],
    maxParticipants: 10,
    isLive: true,
    recordingEnabled: false,
    createdAt: new Date()
  },
  {
    id: "voice-gaming",
    spaceId: "space-1",
    name: "🎮 Gaming",
    description: "Canal para gamers",
    connectedUsers: [],
    maxParticipants: 5,
    isLive: false,
    recordingEnabled: true,
    createdAt: new Date()
  }
]

export const videoCalls: VideoCall[] = [
  {
    id: "call-1",
    spaceId: "space-1",
    channelId: "general",
    participants: [
      {
        id: "user-1",
        name: "Alex",
        avatar: "/admin-avatar.png",
        isHost: true,
        isMuted: false,
        isVideoEnabled: true,
        isScreenSharing: false,
        joinedAt: new Date(Date.now() - 300000)
      },
      {
        id: "user-2",
        name: "Sarah",
        avatar: "/curator-avatar.png",
        isHost: false,
        isMuted: true,
        isVideoEnabled: false,
        isScreenSharing: false,
        joinedAt: new Date(Date.now() - 600000)
      }
    ],
    isActive: true,
    isRecording: false,
    startedAt: new Date(Date.now() - 300000),
    maxParticipants: 8
  }
]

export const chatRoles: ChatRole[] = [
  {
    id: "admin",
    name: "Administrador",
    color: "#ff4444",
    permissions: [
      { id: "manage_channels", name: "Gestionar canales", description: "Crear, editar y eliminar canales", category: "channels" },
      { id: "manage_members", name: "Gestionar miembros", description: "Invitar, expulsar y cambiar roles", category: "members" },
      { id: "moderate_messages", name: "Moderar mensajes", description: "Eliminar mensajes y silenciar usuarios", category: "moderation" }
    ],
    priority: 100
  },
  {
    id: "moderator",
    name: "Moderador",
    color: "#ff8800",
    permissions: [
      { id: "moderate_messages", name: "Moderar mensajes", description: "Eliminar mensajes y silenciar usuarios", category: "moderation" },
      { id: "manage_channels", name: "Gestionar canales", description: "Editar canales existentes", category: "channels" }
    ],
    priority: 50
  },
  {
    id: "member",
    name: "Miembro",
    color: "#00aa00",
    permissions: [
      { id: "send_messages", name: "Enviar mensajes", description: "Enviar mensajes en canales", category: "messages" },
      { id: "join_voice", name: "Unirse a voz", description: "Unirse a canales de voz", category: "channels" }
    ],
    priority: 10
  }
]

export const chatNotifications: ChatNotification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    channelId: "general",
    type: "mention",
    title: "Mencionado en #general",
    body: "Alex te mencionó en un mensaje",
    data: { messageId: "msg-1" },
    isRead: false,
    createdAt: new Date(Date.now() - 5000)
  },
  {
    id: "notif-2",
    userId: "user-1",
    channelId: "voice-general",
    type: "voice",
    title: "Llamada de voz iniciada",
    body: "Sarah inició una llamada en #voice-general",
    data: { callId: "call-1" },
    isRead: true,
    createdAt: new Date(Date.now() - 300000)
  }
]

// Enhanced messages with new features
export const enhancedMessages: Message[] = [
  {
    id: "msg-1",
    channelId: "general",
    authorId: "user-1",
    author: {
      id: "user-1",
      name: "Alex",
      avatar: "/admin-avatar.png",
      role: "Administrador"
    },
    content: "¡Hola a todos! 👋 ¿Cómo están?",
    reactions: [
      { emoji: "👋", count: 3, users: ["user-2", "user-3", "user-4"] },
      { emoji: "🔥", count: 1, users: ["user-5"] }
    ],
    createdAt: new Date(Date.now() - 3600000),
    mentions: ["user-2", "user-3"],
    isPinned: false
  },
  {
    id: "msg-2",
    channelId: "general",
    authorId: "user-2",
    author: {
      id: "user-2",
      name: "Sarah",
      avatar: "/curator-avatar.png",
      role: "Moderador"
    },
    content: "¡Hola @Alex! Todo bien por aquí 😊",
    replyTo: "msg-1",
    reactions: [
      { emoji: "❤️", count: 2, users: ["user-1", "user-6"] }
    ],
    createdAt: new Date(Date.now() - 3500000),
    mentions: ["user-1"]
  },
  {
    id: "msg-3",
    channelId: "general",
    authorId: "user-3",
    author: {
      id: "user-3",
      name: "Carlos",
      avatar: "/developer-profile.png",
      role: "Miembro"
    },
    content: "Aquí tienes el archivo que pediste:",
    attachment: {
      name: "presentacion.pdf",
      url: "/files/presentacion.pdf",
      type: "application/pdf",
      size: 2048576,
      thumbnail: "/thumbnails/pdf-thumb.png"
    },
    createdAt: new Date(Date.now() - 3000000),
    isPinned: true
  },
  {
    id: "msg-4",
    channelId: "general",
    authorId: "user-4",
    author: {
      id: "user-4",
      name: "María",
      avatar: "/artist-profile.png",
      role: "Miembro"
    },
    content: "¡Miren esta imagen que hice! 🎨",
    attachment: {
      name: "arte-digital.jpg",
      url: "/images/arte-digital.jpg",
      type: "image/jpeg",
      size: 1048576,
      thumbnail: "/thumbnails/arte-digital-thumb.jpg"
    },
    reactions: [
      { emoji: "🎨", count: 5, users: ["user-1", "user-2", "user-3", "user-5", "user-6"] },
      { emoji: "👏", count: 3, users: ["user-1", "user-2", "user-3"] }
    ],
    createdAt: new Date(Date.now() - 2400000)
  }
]

// Utility functions for chat features
export const getVoiceChannelsBySpace = (spaceId: string): VoiceChannel[] => {
  return voiceChannels.filter(channel => channel.spaceId === spaceId)
}

export const getVideoCallsBySpace = (spaceId: string): VideoCall[] => {
  return videoCalls.filter(call => call.spaceId === spaceId)
}

export const getChatNotificationsByUser = (userId: string): ChatNotification[] => {
  return chatNotifications.filter(notification => notification.userId === userId)
}

export const getUnreadNotificationsCount = (userId: string): number => {
  return chatNotifications.filter(notification => 
    notification.userId === userId && !notification.isRead
  ).length
}

export const searchChatMessages = (query: string, channelId?: string): ChatSearchResult => {
  const filteredMessages = enhancedMessages.filter(message => {
    const matchesQuery = message.content.toLowerCase().includes(query.toLowerCase()) ||
                        message.author.name.toLowerCase().includes(query.toLowerCase())
    const matchesChannel = !channelId || message.channelId === channelId
    return matchesQuery && matchesChannel
  })

  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(query.toLowerCase()) ||
    channel.description?.toLowerCase().includes(query.toLowerCase())
  )

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase())
  )

  return {
    messages: filteredMessages,
    channels: filteredChannels,
    users: filteredUsers,
    totalResults: filteredMessages.length + filteredChannels.length + filteredUsers.length
  }
}

export const getPinnedMessages = (channelId: string): Message[] => {
  return enhancedMessages.filter(message => 
    message.channelId === channelId && message.isPinned
  )
}

export const getMessageThread = (threadId: string): Message[] => {
  return enhancedMessages.filter(message => 
    message.threadId === threadId || message.replyTo === threadId
  )
}
