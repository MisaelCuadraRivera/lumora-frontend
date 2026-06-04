import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import type { Space } from '@/types'

interface UseSpacesReturn {
  spaces: Space[]
  loading: boolean
  error: string | null
  createSpace: (spaceData: any) => Promise<{ success: boolean; message?: string; data?: Space }>
  updateSpace: (spaceId: string, spaceData: any) => Promise<{ success: boolean; message?: string; data?: Space }>
  deleteSpace: (spaceId: string) => Promise<{ success: boolean; message?: string }>
  joinSpace: (spaceId: string) => Promise<{ success: boolean; message?: string }>
  leaveSpace: (spaceId: string) => Promise<{ success: boolean; message?: string }>
  searchSpaces: (query: string, page?: number, limit?: number) => Promise<{ success: boolean; data?: any; message?: string }>
  refreshSpaces: () => Promise<void>
  getSpace: (spaceId: string) => Promise<{ success: boolean; data?: Space; message?: string }>
}

export function useSpaces(options: { autoFetch?: boolean } = {}): UseSpacesReturn {
  const { autoFetch = true } = options
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSpaces = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getSpaces()
      
      console.log('Response from getSpaces:', response) // Debug log
      
      if (response.success && response.data) {
        // El backend devuelve { success: true, data: { spaces: [...], pagination: {...} } }
        const spacesData = response.data.spaces || response.data
        console.log('Spaces data:', spacesData) // Debug log
        setSpaces(Array.isArray(spacesData) ? spacesData : [])
      } else {
        console.error('Error loading spaces:', response.message)
        setError(response.message || 'Error cargando espacios')
      }
    } catch (err: any) {
      console.error('Error in loadSpaces:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSpace = useCallback(async (spaceData: any) => {
    try {
      const response = await apiService.createSpace(spaceData)
      
      if (response.success && response.data) {
        // Agregar el nuevo espacio a la lista
        setSpaces(prev => [...prev, response.data])
        return { success: true, message: response.message, data: response.data }
      } else {
        return { success: false, message: response.message || 'Error creando espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const updateSpace = useCallback(async (spaceId: string, spaceData: any) => {
    try {
      const response = await apiService.updateSpace(spaceId, spaceData)
      
      if (response.success && response.data) {
        // Actualizar el espacio en la lista
        setSpaces(prev => prev.map(space => 
          space.id === spaceId ? { ...space, ...response.data } : space
        ))
        return { success: true, message: response.message, data: response.data }
      } else {
        return { success: false, message: response.message || 'Error actualizando espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const deleteSpace = useCallback(async (spaceId: string) => {
    try {
      const response = await apiService.deleteSpace(spaceId)
      
      if (response.success) {
        // Remover el espacio de la lista
        setSpaces(prev => prev.filter(space => space.id !== spaceId))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error eliminando espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const getSpace = useCallback(async (spaceId: string) => {
    try {
      const response = await apiService.getSpace(spaceId)
      
      if (response.success && response.data) {
        return { success: true, data: response.data, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error obteniendo espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const searchSpaces = useCallback(async (query: string, page = 1, limit = 20) => {
    try {
      const response = await apiService.searchSpaces(query, page, limit)
      
      if (response.success && response.data) {
        return { success: true, data: response.data, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error buscando espacios' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const joinSpace = useCallback(async (spaceId: string) => {
    try {
      const response = await apiService.joinSpace(spaceId)
      
      if (response.success) {
        // Actualizar el estado de membresía del espacio
        setSpaces(prev => prev.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              isJoined: true,
              memberCount: space.memberCount + 1
            }
          }
          return space
        }))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error uniéndose al espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const leaveSpace = useCallback(async (spaceId: string) => {
    try {
      const response = await apiService.leaveSpace(spaceId)
      
      if (response.success) {
        // Actualizar el estado de membresía del espacio
        setSpaces(prev => prev.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              isJoined: false,
              memberCount: Math.max(0, space.memberCount - 1)
            }
          }
          return space
        }))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error saliendo del espacio' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])


  const refreshSpaces = useCallback(async () => {
    await loadSpaces()
  }, [loadSpaces])

  // Cargar espacios iniciales
  useEffect(() => {
    if (autoFetch) {
      loadSpaces()
    }
  }, [loadSpaces, autoFetch])

  return {
    spaces,
    loading,
    error,
    createSpace,
    updateSpace,
    deleteSpace,
    joinSpace,
    leaveSpace,
    searchSpaces,
    refreshSpaces,
    getSpace
  }
}


