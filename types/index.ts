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
