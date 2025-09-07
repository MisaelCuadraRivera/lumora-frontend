import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import type { Space } from '@/types'

interface UseSpaceReturn {
  space: Space | null
  loading: boolean
  error: string | null
  refreshSpace: () => Promise<void>
  updateSpace: (spaceData: any) => Promise<{ success: boolean; message?: string; data?: Space }>
  deleteSpace: () => Promise<{ success: boolean; message?: string }>
  joinSpace: () => Promise<{ success: boolean; message?: string }>
  leaveSpace: () => Promise<{ success: boolean; message?: string }>
}

export function useSpace(spaceId: string): UseSpaceReturn {
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSpace = useCallback(async () => {
    if (!spaceId) return

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getSpace(spaceId)
      
      if (response.success && response.data) {
        setSpace(response.data)
      } else {
        setError(response.message || 'Error cargando espacio')
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [spaceId])

  const refreshSpace = useCallback(async () => {
    await loadSpace()
  }, [loadSpace])

  const updateSpace = useCallback(async (spaceData: any) => {
    try {
      const response = await apiService.updateSpace(spaceId, spaceData)
      
      if (response.success && response.data) {
        setSpace(response.data)
        return { success: true, message: response.message, data: response.data }
      } else {
        return { success: false, message: response.message || 'Error actualizando espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId])

  const deleteSpace = useCallback(async () => {
    try {
      const response = await apiService.deleteSpace(spaceId)
      
      if (response.success) {
        setSpace(null)
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error eliminando espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId])

  const joinSpace = useCallback(async () => {
    try {
      const response = await apiService.joinSpace(spaceId)
      
      if (response.success && space) {
        setSpace({
          ...space,
          isJoined: true,
          memberCount: space.memberCount + 1
        })
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error uniéndose al espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId, space])

  const leaveSpace = useCallback(async () => {
    try {
      const response = await apiService.leaveSpace(spaceId)
      
      if (response.success && space) {
        setSpace({
          ...space,
          isJoined: false,
          memberCount: Math.max(0, space.memberCount - 1)
        })
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error saliendo del espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId, space])

  // Cargar espacio inicial
  useEffect(() => {
    loadSpace()
  }, [loadSpace])

  return {
    space,
    loading,
    error,
    refreshSpace,
    updateSpace,
    deleteSpace,
    joinSpace,
    leaveSpace
  }
}
