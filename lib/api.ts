// API service para conectar con el backend de Lumora
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Obtener token del localStorage si existe
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('lumora_token')
    }
  }

  // Configurar token de autenticación
  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('lumora_token', token)
      } else {
        localStorage.removeItem('lumora_token')
      }
    }
  }

  // Obtener headers para las peticiones
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  // Método genérico para hacer peticiones
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      })

      const data = await response.json()
      
      console.log(`Response from ${url}:`, {
        status: response.status,
        ok: response.ok,
        data: data
      })

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 429) {
          console.warn('Rate limit exceeded, retrying after delay...')
          // Esperar un poco antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 2000))
          // Reintentar una vez
          return this.request<T>(endpoint, options)
        }
        
        if (response.status === 401) {
          // Token inválido, limpiar
          this.setToken(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('lumora_user')
          }
        }
        
        throw new Error(data.message || 'Error en la petición')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`Making GET request to: ${this.baseURL}${endpoint}`)
    console.log('Token:', this.token ? 'Present' : 'Missing')
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Métodos específicos de autenticación
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponseData>> {
    const response = await this.post<RegisterResponseData>('/auth/register', userData)
    
    if (response.success && response.data) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    const response = await this.post<LoginResponseData>('/auth/login', { email, password })
    
    if (response.success && response.data) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async getProfile(): Promise<ApiResponse<ProfileResponseData>> {
    return this.get<ProfileResponseData>('/auth/profile')
  }

  async updateProfile(userData: any) {
    return this.put('/auth/profile', userData)
  }

  async verifyToken() {
    return this.get('/auth/verify')
  }

  // Métodos de posts
  async getFeed(page = 1, limit = 20) {
    return this.get(`/posts/feed?page=${page}&limit=${limit}`)
  }

  async createPost(postData: any) {
    return this.post('/posts', postData)
  }

  async getPost(postId: string) {
    return this.get(`/posts/${postId}`)
  }

  async updatePost(postId: string, postData: any) {
    return this.put(`/posts/${postId}`, postData)
  }

  async deletePost(postId: string) {
    return this.delete(`/posts/${postId}`)
  }

  async toggleLike(postId: string) {
    return this.post(`/posts/${postId}/like`)
  }

  // Métodos de espacios
  async getSpaces() {
    return this.get('/spaces')
  }

  async createSpace(spaceData: any) {
    return this.post('/spaces', spaceData)
  }

  async getSpace(spaceId: string) {
    return this.get(`/spaces/${spaceId}`)
  }

  async joinSpace(spaceId: string) {
    return this.post(`/spaces/${spaceId}/join`)
  }

  async leaveSpace(spaceId: string) {
    return this.delete(`/spaces/${spaceId}/leave`)
  }

  async updateSpace(spaceId: string, spaceData: any) {
    return this.put(`/spaces/${spaceId}`, spaceData)
  }

  async deleteSpace(spaceId: string) {
    return this.delete(`/spaces/${spaceId}`)
  }

  async searchSpaces(query: string, page = 1, limit = 20) {
    return this.get(`/spaces/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  }

  // Métodos de facetas
  async getFacets() {
    return this.get('/facets')
  }

  async createFacet(facetData: any) {
    return this.post('/facets', facetData)
  }

  async updateFacet(facetId: string, facetData: any) {
    return this.put(`/facets/${facetId}`, facetData)
  }

  async deleteFacet(facetId: string) {
    return this.delete(`/facets/${facetId}`)
  }

  async toggleFacet(facetId: string) {
    return this.post(`/facets/${facetId}/toggle`)
  }

  // Métodos de marketplace
  async getProducts(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : ''
    return this.get(`/marketplace/products${queryParams}`)
  }

  async createProduct(productData: any) {
    return this.post('/marketplace/products', productData)
  }

  async getCart() {
    return this.get('/marketplace/cart')
  }

  async addToCart(productId: string, quantity = 1) {
    return this.post('/marketplace/cart/add', { productId, quantity })
  }

  // Métodos de eventos
  async getEvents(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : ''
    return this.get(`/events${queryParams}`)
  }

  // Métodos de tareas
  async getTasks(spaceId: string) {
    return this.get(`/spaces/${spaceId}/tasks`)
  }

  async createTask(spaceId: string, taskData: any) {
    return this.post(`/spaces/${spaceId}/tasks`, taskData)
  }

  async updateTask(taskId: string, taskData: any) {
    return this.put(`/tasks/${taskId}`, taskData)
  }

  async deleteTask(taskId: string) {
    return this.delete(`/tasks/${taskId}`)
  }

  async moveTask(taskId: string, newColumn: string) {
    return this.post(`/tasks/${taskId}/move`, { newColumn })
  }

  // Métodos de chat
  async getChannels(spaceId: string) {
    return this.get(`/spaces/${spaceId}/channels`)
  }

  async getMessages(channelId: string, page = 1, limit = 50) {
    return this.get(`/channels/${channelId}/messages?page=${page}&limit=${limit}`)
  }

  async sendMessage(channelId: string, messageData: any) {
    return this.post(`/channels/${channelId}/messages`, messageData)
  }

  async getPinnedMessages(channelId: string) {
    return this.get(`/channels/${channelId}/pinned`)
  }

  async pinMessage(messageId: string) {
    return this.post(`/messages/${messageId}/pin`)
  }

  // Métodos de notificaciones
  async getNotifications() {
    return this.get('/notifications')
  }

  async markNotificationAsRead(notificationId: string) {
    return this.put(`/notifications/${notificationId}/read`)
  }

  async deleteNotification(notificationId: string) {
    return this.delete(`/notifications/${notificationId}`)
  }

  // Métodos de búsqueda
  async search(query: string, filters?: any) {
    const queryParams = new URLSearchParams({ q: query, ...filters })
    return this.get(`/search?${queryParams.toString()}`)
  }

  async searchUsers(query: string) {
    return this.get(`/search/users?q=${encodeURIComponent(query)}`)
  }

  async searchPosts(query: string) {
    return this.get(`/search/posts?q=${encodeURIComponent(query)}`)
  }

  // Métodos de eventos
  async createEvent(eventData: any) {
    return this.post('/events', eventData)
  }

  async getUserEvents(page = 1, limit = 20) {
    return this.get(`/events/my-events?page=${page}&limit=${limit}`)
  }

  async getPublicEvents(page = 1, limit = 20, filters: any = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })
    return this.get(`/events/public?${queryParams}`)
  }

  async getEventById(eventId: string) {
    return this.get(`/events/${eventId}`)
  }

  async getEventByIdWithoutIncrement(eventId: string) {
    // Método alternativo que no incrementa vistas (para evitar errores de viewsCount)
    // Usar el endpoint público y filtrar por ID
    const response = await this.getPublicEvents(1, 1000)
    if (response.success && response.data && typeof response.data === 'object' && response.data !== null && 'events' in response.data) {
      const events = (response.data as any).events
      const event = events.find((e: any) => e.id === eventId)
      if (event) {
        return { success: true, data: event }
      }
    }
    return { success: false, message: 'Evento no encontrado' }
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.put(`/events/${eventId}`, eventData)
  }

  async deleteEvent(eventId: string) {
    return this.delete(`/events/${eventId}`)
  }

  async attendEvent(eventId: string) {
    return this.post(`/events/${eventId}/attend`)
  }

  async cancelAttendance(eventId: string) {
    return this.delete(`/events/${eventId}/attend`)
  }

  async searchEvents(query: string, page = 1, limit = 20) {
    return this.get(`/events/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  }

  async getSpaceEvents(spaceId: string, page = 1, limit = 20) {
    return this.get(`/events/space/${spaceId}?page=${page}&limit=${limit}`)
  }

  async getCalendarEvents(startDate: string, endDate: string) {
    return this.get(`/events/calendar?startDate=${startDate}&endDate=${endDate}`)
  }
}

// Instancia singleton del servicio API
export const apiService = new ApiService(API_BASE_URL)

// Exportar la clase para casos especiales
export { ApiService }

// Tipos para TypeScript
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: any
  facets?: any[]
  token: string
}

export interface LoginResponseData {
  user: any
  facets: any[]
  token: string
}

export interface RegisterResponseData {
  user: any
  facet: any
  token: string
}

export interface ProfileResponseData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  createdAt: string
  facets: any[]
  isVerified: boolean
  preferences: any
  followers: string[]
  following: string[]
  blockedUsers: string[]
  stats: any
}

export interface PostRequest {
  content: string
  type?: 'text' | 'image' | 'video' | 'audio' | 'link' | 'poll'
  facetId?: string
  spaceId?: string
  media?: any[]
  tags?: string[]
  mentions?: string[]
  isPublic?: boolean
}

export interface SpaceRequest {
  name: string
  description?: string
  category: 'comunidad' | 'proyecto' | 'club' | 'tienda' | 'evento' | 'otro'
  image?: string
  banner?: string
  isPublic?: boolean
  tags?: string[]
  settings?: any
}

export interface FacetRequest {
  name: string
  description?: string
  category: 'artista' | 'profesional' | 'viajero' | 'gamer' | 'escritor' | 'otro'
  avatar?: string
  isPublic?: boolean
  settings?: any
}
