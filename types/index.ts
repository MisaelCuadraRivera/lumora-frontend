export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  createdAt: Date
  facets: Facet[]
  isOnline?: boolean
  isVerified?: boolean
  preferences?: Record<string, any>
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
  isPublic?: boolean
  createdAt: Date
  channels?: Channel[]
  ownerId?: string
  owner?: User
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
    size?: number
    thumbnail?: string
  }
  reactions?: Reaction[]
  createdAt: Date
  editedAt?: Date
  replyTo?: string
  isPinned?: boolean
  isEdited?: boolean
  mentions?: string[]
  threadId?: string
  threadCount?: number
}

export interface VoiceChannel {
  id: string
  spaceId: string
  name: string
  description?: string
  connectedUsers: VoiceUser[]
  maxParticipants: number
  isLive: boolean
  recordingEnabled: boolean
  createdAt: Date
}

export interface VoiceUser {
  id: string
  name: string
  avatar?: string
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
  joinedAt: Date
}

export interface VideoCall {
  id: string
  spaceId: string
  channelId: string
  participants: VideoParticipant[]
  isActive: boolean
  isRecording: boolean
  startedAt: Date
  endedAt?: Date
  maxParticipants: number
}

export interface VideoParticipant {
  id: string
  name: string
  avatar?: string
  isHost: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  joinedAt: Date
}

export interface ChatRole {
  id: string
  name: string
  color: string
  permissions: ChatPermission[]
  priority: number
}

export interface ChatPermission {
  id: string
  name: string
  description: string
  category: "messages" | "channels" | "members" | "moderation"
}

export interface ChatNotification {
  id: string
  userId: string
  channelId: string
  type: "message" | "mention" | "reaction" | "voice" | "video"
  title: string
  body: string
  data?: any
  isRead: boolean
  createdAt: Date
}

export interface ChatSearchResult {
  messages: Message[]
  channels: Channel[]
  users: User[]
  totalResults: number
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

// MARKETPLACE TYPES
export interface Product {
  id: string
  sellerId: string
  seller: User
  spaceId?: string
  space?: Space
  title: string
  description: string
  price: number
  currency: "USD" | "EUR" | "MXN"
  category: ProductCategory
  subcategory?: string
  images: string[]
  tags: string[]
  condition: "new" | "like_new" | "good" | "fair" | "poor"
  stock: number
  isDigital: boolean
  digitalDelivery?: boolean
  shippingInfo?: ShippingInfo
  status: "active" | "inactive" | "sold_out" | "draft"
  views: number
  likes: number
  sales: number
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  icon: string
  description: string
  subcategories?: string[]
}

export interface ShippingInfo {
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  shippingMethods: ShippingMethod[]
  freeShipping?: boolean
}

export interface ShippingMethod {
  id: string
  name: string
  price: number
  estimatedDays: number
  description?: string
}

export interface Order {
  id: string
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  productId: string
  product: Product
  quantity: number
  totalPrice: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress?: Address
  billingAddress?: Address
  paymentMethod?: PaymentMethod
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface Address {
  id: string
  userId: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "paypal" | "stripe"
  last4?: string
  brand?: string
  isDefault: boolean
  isActive: boolean
}

export interface Review {
  id: string
  productId: string
  product: Product
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  orderId: string
  rating: number
  title: string
  comment: string
  images?: string[]
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalItems: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  addedAt: Date
}

// EVENTOS TYPES
export interface Event {
  id: string
  userId: string
  creator: User
  spaceId?: string
  space?: Space
  title: string
  description: string
  type: EventType
  category: EventCategory
  startDate: Date
  endDate: Date
  timezone: string
  location: EventLocation
  onlineUrl?: string
  image?: string
  banner?: string
  isPublic: boolean
  isActive: boolean
  maxAttendees?: number
  currentAttendees: number
  attendees: EventAttendee[]
  price: number
  currency: string
  tickets: any[]
  tags: string[]
  speakers: any[]
  sponsors: any[]
  streaming: EventStream
  settings: any
  stats: any
  createdAt: Date
  updatedAt: Date
}

export type EventType = "online" | "offline" | "hybrid"
export type EventCategory = "conference" | "workshop" | "meetup" | "concert" | "exhibition" | "sports" | "other"
export type EventStatus = "draft" | "published" | "cancelled" | "completed" | "sold_out"

export interface EventLocation {
  type: "physical" | "virtual" | "hybrid"
  address?: string
  city?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
  virtualUrl?: string
  platform?: "zoom" | "teams" | "discord" | "custom"
  instructions?: string
}

export interface Ticket {
  id: string
  eventId: string
  event: Event
  name: string
  description: string
  price: number
  currency: string
  quantity: number
  sold: number
  available: number
  benefits: string[]
  isActive: boolean
  saleStartDate: Date
  saleEndDate: Date
  maxPerUser: number
  createdAt: Date
  updatedAt: Date
}

export interface EventAttendee {
  id: string
  eventId: string
  event: Event
  userId: string
  user: User
  ticketId?: string
  ticket?: Ticket
  status: AttendeeStatus
  rsvpDate: Date
  checkInDate?: Date
  checkOutDate?: Date
  notes?: string
  isPaid: boolean
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export type AttendeeStatus = "registered" | "confirmed" | "attended" | "cancelled" | "waitlist"

export interface EventStream {
  id: string
  eventId: string
  event: Event
  title: string
  description: string
  streamUrl: string
  streamKey: string
  status: StreamStatus
  startTime: Date
  endTime?: Date
  maxViewers: number
  currentViewers: number
  totalViewers: number
  chatEnabled: boolean
  recordingEnabled: boolean
  quality: "720p" | "1080p" | "4k"
  createdAt: Date
  updatedAt: Date
}

export type StreamStatus = "scheduled" | "live" | "ended" | "failed"

export interface EventChat {
  id: string
  eventId: string
  event: Event
  userId: string
  user: User
  message: string
  type: "text" | "reaction" | "question" | "moderation"
  isModerated: boolean
  isHighlighted: boolean
  createdAt: Date
}

export interface EventAnalytics {
  eventId: string
  event: Event
  totalRegistrations: number
  totalAttendees: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  socialShares: number
  websiteVisits: number
  conversionRate: number
  topReferrers: string[]
  attendeeDemographics: {
    ageGroups: Record<string, number>
    locations: Record<string, number>
    interests: Record<string, number>
  }
  engagementMetrics: {
    averageWatchTime: number
    chatMessages: number
    questionsAsked: number
    reactions: number
  }
  createdAt: Date
  updatedAt: Date
}

export type TaskPriority = "low" | "medium" | "high" | "urgent"
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done"

export interface TaskAssignee {
  id: string
  username: string
  avatar?: string
}

export interface TaskChecklistItem {
  id: string
  content: string
  done: boolean
}

export interface TaskComment {
  id: string
  author: User
  content: string
  createdAt: Date
}

export interface Task {
  id: string
  spaceId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignees: TaskAssignee[]
  dueDate?: Date
  tags: string[]
  checklist: TaskChecklistItem[]
  comments: TaskComment[]
  createdAt: Date
  updatedAt: Date
}

export interface TaskColumn {
  id: TaskStatus
  title: string
  taskIds: string[]
}

export interface KanbanBoard {
  spaceId: string
  columns: TaskColumn[]
  tasks: Record<string, Task>
}

// NOTIFICATIONS TYPES
export interface Notification {
  id: string
  userId: string
  type: "like" | "comment" | "follow" | "mention" | "space_invite" | "task_assignment" | "event_reminder" | "marketplace_purchase" | "space_join"
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  actor?: {
    id: string
    name: string
    avatar?: string
  }
}
