import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Post, Comment, User, Facet } from '@/types'

const safeDate = (date: any): Date => {
  if (!date) return new Date()
  return date instanceof Date ? date : new Date(date)
}

const normalizeUser = (data: any, fallback?: any): User => {
  const u = data || fallback || {}
  
  // Ensure stats structure exists
  const stats = u.stats || {}
  
  return {
    id: u.id || '',
    username: u.username || 'Usuario',
    email: u.email || '',
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    avatar: u.avatar || '/placeholder.svg',
    bio: u.bio || '',
    createdAt: safeDate(u.createdAt),
    facets: Array.isArray(u.facets) ? u.facets : [],
    isOnline: !!u.isOnline,
    isVerified: !!u.isVerified,
    preferences: u.preferences || {},
    followers: Array.isArray(u.followers) ? u.followers : [],
    following: Array.isArray(u.following) ? u.following : [],
    blockedUsers: Array.isArray(u.blockedUsers) ? u.blockedUsers : [],
    stats: {
        posts: typeof stats.posts === 'number' ? stats.posts : 0,
        followers: typeof stats.followers === 'number' ? stats.followers : 0,
        following: typeof stats.following === 'number' ? stats.following : 0,
        likes: typeof stats.likes === 'number' ? stats.likes : 0,
        views: typeof stats.views === 'number' ? stats.views : 0
    }
  }
}

const countCommentsRecursively = (comments: any[]): number => {
  if (!Array.isArray(comments)) return 0
  let count = comments.length
  comments.forEach(comment => {
    if (comment.replies && Array.isArray(comment.replies)) {
      count += countCommentsRecursively(comment.replies)
    }
  });
  return count
}

// Función para normalizar posts del backend
export const normalizePost = (post: any, currentUser?: any): Post => {
  // El backend envía los datos del usuario en 'user', 'author' o a veces viene aplanado
  const userData = post.user || post.author || post.creator
  // Si no hay datos de autor válidos en el post, usamos currentUser como último recurso (para optimistic updates)
  const hasAuthorInfo = userData && (userData.id || userData.username)
  const authorData = hasAuthorInfo ? userData : currentUser

  const validCategories: Facet['category'][] = ["artista", "profesional", "viajero", "gamer", "escritor", "otro"]
  const facetCategory = post.facet?.category
  const normalizedCategory = validCategories.includes(facetCategory) ? facetCategory : 'otro'

  const likes = typeof post.likesCount === 'number' ? post.likesCount : 
                typeof post.likes_count === 'number' ? post.likes_count :
                typeof post.totalLikes === 'number' ? post.totalLikes :
                (Array.isArray(post.likes) ? post.likes.length : (typeof post.likes === 'number' ? post.likes : 0))

  const commentsData = Array.isArray(post.comments) ? post.comments.map(normalizeComment) : []
  
  // Si el backend nos da un contador explícito, lo preferimos, 
  // de lo contrario contamos recursivamente todos los comentarios y respuestas.
  const commentsCount = typeof post.commentsCount === 'number' ? post.commentsCount :
                        typeof post.comments_count === 'number' ? post.comments_count :
                        countCommentsRecursively(post.comments || [])

  const shares = typeof post.sharesCount === 'number' ? post.sharesCount : 
                 typeof post.shares_count === 'number' ? post.shares_count :
                 (typeof post.shares === 'number' ? post.shares : 0)

  return {
    id: post.id || '',
    authorId: post.authorId || authorData?.id || '',
    author: normalizeUser(authorData),
    facetId: post.facetId,
    facet: post.facet ? {
      id: post.facet.id,
      name: post.facet.name,
      description: post.facet.description || '',
      avatar: post.facet.avatar,
      isActive: !!post.facet.isActive,
      category: normalizedCategory
    } : undefined,
    content: post.content || '',
    images: post.images || [],
    links: post.links || [],
    tags: post.tags || [],
    likes: likes,
    likesCount: likes, // Compatibilidad
    shares: shares,
    sharesCount: shares, // Compatibilidad
    comments: commentsData,
    commentsCount: commentsCount, // Compatibilidad
    createdAt: safeDate(post.createdAt),
    updatedAt: safeDate(post.updatedAt),
    spaceId: post.spaceId,
    isLiked: !!(post.isLiked || post.liked || post.is_liked ||
             (Array.isArray(post.likes) && currentUser && post.likes.includes(currentUser.id)) || 
             (Array.isArray(post.likedBy) && currentUser && post.likedBy.includes(currentUser.id)) || 
             (Array.isArray(post.interactions) && currentUser && post.interactions.some((i: any) => i.userId === currentUser.id && i.type === 'like')))
  }
}

export const normalizeComment = (comment: any): Comment => ({
  id: comment.id || '',
  postId: comment.postId || '',
  authorId: comment.authorId || comment.author?.id || comment.user?.id || '',
  author: normalizeUser(comment.author || comment.user),
  content: comment.content || '',
  likes: typeof comment.likes === 'number' ? comment.likes : (comment.likesCount || 0),
  createdAt: safeDate(comment.createdAt),
  replies: Array.isArray(comment.replies) ? comment.replies.map(normalizeComment) : []
})

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
  addComment: (postId: string, content: string) => Promise<{ success: boolean; message?: string }>
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
        const data = response.data as any
        const rawPosts = data.posts || data
        // Pasar user como fallback, pero normalizePost decidirá cuándo usarlo
        const newPosts = Array.isArray(rawPosts) ? rawPosts.map((post: any) => normalizePost(post, user)) : []
        
        if (reset) {
          setPosts(newPosts)
        } else {
          setPosts(prev => [...prev, ...newPosts])
        }

        // Verificar si hay más páginas
        if (data.pagination) {
          setHasMore(pageNum < data.pagination.pages)
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
      
      if (response.success) {
        // Actualizar el estado del like en el post
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            // Si el backend devuelve el estado actualizado, usarlo
            const data = response.data as any;
            const liked = data?.liked ?? !post.isLiked;
            const likesCount = data?.likesCount ?? data?.likes_count ?? (liked ? post.likes + 1 : post.likes - 1);
            
            return {
              ...post,
              likes: Math.max(0, likesCount),
              likesCount: Math.max(0, likesCount),
              isLiked: liked
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

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const response = await apiService.addComment(postId, content)
      
      if (response.success && response.data) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
             // Asumimos que el backend devuelve el comentario creado
             const newComment = normalizeComment(response.data)
             // Prependemos el comentario para que salga arriba (nuevo primero)
             const comments = post.comments ? [newComment, ...post.comments] : [newComment]
             const count = (post.commentsCount || post.comments?.length || 0) + 1
             return {
               ...post,
               comments,
               commentsCount: count,
               comments_count: count
             }
          }
          return post
        }))
        return { success: true, message: response.message }
      } else {
         return { success: false, message: response.message || 'Error al comentar' }
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
    toggleLike,
    addComment,
  }
}


