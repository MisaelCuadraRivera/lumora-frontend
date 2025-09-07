import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Post } from '@/types'

// Función para normalizar posts del backend
const normalizePost = (post: any, currentUser?: any): Post => {
  // El backend envía los datos del usuario en 'user', no en 'author'
  const userData = post.user || post.author
  const hasAuthorInfo = userData && (userData.id || userData.username)
  const fallbackUser = hasAuthorInfo ? null : currentUser
  
  return {
    id: post.id || '',
    authorId: post.authorId || userData?.id || '',
    author: {
      id: userData?.id || fallbackUser?.id || '',
      username: userData?.username || fallbackUser?.username || 'Usuario',
      avatar: userData?.avatar || fallbackUser?.avatar || '/placeholder.svg',
      email: userData?.email || fallbackUser?.email || '',
      firstName: userData?.firstName || fallbackUser?.firstName || '',
      lastName: userData?.lastName || fallbackUser?.lastName || '',
      bio: userData?.bio || fallbackUser?.bio || '',
      createdAt: new Date(userData?.createdAt || fallbackUser?.createdAt || Date.now()),
      facets: userData?.facets || fallbackUser?.facets || [],
      isOnline: userData?.isOnline || fallbackUser?.isOnline || false,
      isVerified: userData?.isVerified || fallbackUser?.isVerified || false,
      preferences: userData?.preferences || fallbackUser?.preferences || {},
      followers: userData?.followers || fallbackUser?.followers || [],
      following: userData?.following || fallbackUser?.following || [],
      blockedUsers: userData?.blockedUsers || fallbackUser?.blockedUsers || [],
      stats: userData?.stats || fallbackUser?.stats || {
        posts: 0,
        followers: 0,
        following: 0,
        likes: 0,
        views: 0
      }
    },
    facetId: post.facetId,
    facet: post.facet ? {
      id: post.facet.id,
      name: post.facet.name,
      description: post.facet.description || '',
      avatar: post.facet.avatar,
      isActive: post.facet.isActive || false,
      category: post.facet.category || 'otro'
    } : undefined,
    content: post.content || '',
    images: post.images || [],
    links: post.links || [],
    tags: post.tags || [],
    likes: post.likes || post.likesCount || 0,
    shares: post.shares || post.sharesCount || 0,
    comments: post.comments || [],
    createdAt: new Date(post.createdAt || Date.now()),
    updatedAt: new Date(post.updatedAt || Date.now()),
    spaceId: post.spaceId
  }
}

interface UsePostsOptions {
  spaceId?: string
  userId?: string
  initialPage?: number
  pageSize?: number
}

interface UsePostsReturn {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  createPost: (postData: any) => Promise<{ success: boolean; message?: string }>
  updatePost: (postId: string, postData: any) => Promise<{ success: boolean; message?: string }>
  deletePost: (postId: string) => Promise<{ success: boolean; message?: string }>
  toggleLike: (postId: string) => Promise<{ success: boolean; message?: string }>
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { spaceId, userId, initialPage = 1, pageSize = 20 } = options
  const { user } = useAuth()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(initialPage)

  const loadPosts = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true)
    setError(null)

    try {
      let response
      
      if (spaceId) {
        response = await apiService.getSpacePosts(spaceId, pageNum, pageSize)
      } else if (userId) {
        response = await apiService.getUserPosts(userId, pageNum, pageSize)
      } else {
        response = await apiService.getFeed(pageNum, pageSize)
      }

      if (response.success && response.data) {
        const rawPosts = response.data.posts || response.data
        // Pasar user como fallback, pero normalizePost decidirá cuándo usarlo
        const newPosts = Array.isArray(rawPosts) ? rawPosts.map(post => normalizePost(post, user)) : []
        
        if (reset) {
          setPosts(newPosts)
        } else {
          setPosts(prev => [...prev, ...newPosts])
        }

        // Verificar si hay más páginas
        if (response.data.pagination) {
          setHasMore(pageNum < response.data.pagination.pages)
        } else {
          setHasMore(newPosts.length === pageSize)
        }
      } else {
        setError(response.message || 'Error cargando posts')
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [spaceId, userId, pageSize, user])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      await loadPosts(nextPage, false)
    }
  }, [loading, hasMore, page, loadPosts])

  const refresh = useCallback(async () => {
    setPage(1)
    await loadPosts(1, true)
  }, [loadPosts])

  const createPost = useCallback(async (postData: any) => {
    try {
      const response = await apiService.createPost(postData)
      
      if (response.success && response.data) {
        // Agregar el nuevo post al inicio de la lista
        // normalizePost decidirá si usar la información del backend o el fallback
        const normalizedPost = normalizePost(response.data, user)
        setPosts(prev => [normalizedPost, ...prev])
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error creando post' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [user])

  const updatePost = useCallback(async (postId: string, postData: any) => {
    try {
      const response = await apiService.updatePost(postId, postData)
      
      if (response.success && response.data) {
        // Actualizar el post en la lista
        // normalizePost decidirá si usar la información del backend o el fallback
        const normalizedPost = normalizePost(response.data, user)
        setPosts(prev => prev.map(post => 
          post.id === postId ? normalizedPost : post
        ))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error actualizando post' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [user])

  const deletePost = useCallback(async (postId: string) => {
    try {
      const response = await apiService.deletePost(postId)
      
      if (response.success) {
        // Remover el post de la lista
        setPosts(prev => prev.filter(post => post.id !== postId))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error eliminando post' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const toggleLike = useCallback(async (postId: string) => {
    try {
      const response = await apiService.toggleLike(postId)
      
      if (response.success && response.data) {
        // Actualizar el estado del like en el post
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            const newLikesCount = response.data.liked 
              ? post.likesCount + 1 
              : post.likesCount - 1
            
            return {
              ...post,
              likesCount: Math.max(0, newLikesCount),
              isLiked: response.data.liked
            }
          }
          return post
        }))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error con el like' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  // Cargar posts iniciales
  useEffect(() => {
    loadPosts(1, true)
  }, [loadPosts])

  return {
    posts,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    refresh,
    createPost,
    updatePost,
    deletePost,
    toggleLike
  }
}


