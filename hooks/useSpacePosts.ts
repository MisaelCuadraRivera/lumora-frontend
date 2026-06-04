"use client"

import useSWR from 'swr'
import { useCallback } from 'react'
import { apiService } from '@/lib/api'
import { normalizePost } from '@/hooks/usePosts'
import { useAuth } from '@/lib/auth'
import type { Post } from '@/types'

export function useSpacePosts(spaceId: string) {
  const { user } = useAuth()

  // Fetcher usando el apiService singleton
  const fetcher = useCallback(async () => {
    if (!spaceId) return []
    const response = await apiService.getSpacePosts(spaceId)
    if (response.success && response.data) {
      const postsArray = Array.isArray(response.data) 
        ? response.data 
        : ((response.data as any).posts || [])
      return postsArray.map((post: any) => normalizePost(post, user))
    }
    throw new Error(response.message || 'Error cargando posts del espacio')
  }, [spaceId, user])

  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>(
    spaceId ? `/posts/space/${spaceId}` : null,
    fetcher
  )

  const createPost = useCallback(async (content: string, facetId?: string, tags: string[] = []) => {
    if (!spaceId) return { success: false, message: 'Falta spaceId' }
    try {
      const response = await apiService.createPost({
        content,
        spaceId,
        facetId,
        tags
      })
      
      if (response.success && response.data) {
        const newPost = normalizePost(response.data, user)
        
        // Mutación optimista en SWR: añade el post al principio de la caché
        mutate((currentPosts) => {
          return [newPost, ...(currentPosts || [])]
        }, { revalidate: true })
        
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || 'Error al crear post' }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId, user, mutate])

  return {
    posts: posts || [],
    loading: isLoading,
    error: error ? error.message : null,
    createPost,
    refreshPosts: mutate
  }
}
