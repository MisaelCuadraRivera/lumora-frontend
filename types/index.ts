export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: Date
  facets: Facet[]
  isOnline?: boolean
  followers: string[]
  following: string[]
  blockedUsers: string[]
  isBlocked?: boolean
  stats: {
    posts: number
    followers: number
    following: number
    likes: number
    views: number
  }
}

export interface Facet {
  id: string
  name: string
  description: string
  avatar?: string
  isActive: boolean
  category: "artista" | "profesional" | "viajero" | "gamer" | "escritor" | "otro"
}

export interface Post {
  id: string
  authorId: string
  author: User
  facetId?: string
  facet?: Facet
  content: string
  images?: string[]
  links?: string[]
  tags: string[]
  likes: number
  shares: number
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  spaceId?: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  likes: number
  createdAt: Date
  replies?: Comment[]
}

export interface Space {
  id: string
  name: string
  description: string
  image?: string
  banner?: string
  memberCount: number
  activeMembers: number
  category: string
  tags: string[]
  isJoined: boolean
  createdAt: Date
  channels?: Channel[]
}

export interface Channel {
  id: string
  spaceId: string
  name: string
  description?: string
  type: "text" | "voice"
  memberCount?: number
  unreadCount?: number
  connectedUsers?: number
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  author: {
    id: string
    name: string
    avatar?: string
    role?: string
  }
  content: string
  attachment?: {
    name: string
    url: string
    type: string
  }
  reactions?: Reaction[]
  createdAt: Date
  editedAt?: Date
  replyTo?: string
}

export interface Reaction {
  emoji: string
  count: number
  users?: string[]
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId?: string
  reportedPostId?: string
  reportedSpaceId?: string
  reason: "spam" | "harassment" | "inappropriate" | "fake_news" | "copyright" | "other"
  description: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  createdAt: Date
  reviewedAt?: Date
  moderatorId?: string
}
