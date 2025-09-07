import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import type { Facet } from '@/types'

interface UseFacetsReturn {
  facets: Facet[]
  loading: boolean
  error: string | null
  activeFacet: Facet | null
  createFacet: (facetData: any) => Promise<{ success: boolean; message?: string }>
  updateFacet: (facetId: string, facetData: any) => Promise<{ success: boolean; message?: string }>
  deleteFacet: (facetId: string) => Promise<{ success: boolean; message?: string }>
  toggleFacet: (facetId: string) => Promise<{ success: boolean; message?: string }>
  refreshFacets: () => Promise<void>
}

export function useFacets(): UseFacetsReturn {
  const [facets, setFacets] = useState<Facet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFacets = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.getFacets()
      
      if (response.success && response.data) {
        setFacets(response.data)
      } else {
        setError(response.message || 'Error cargando facetas')
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const createFacet = useCallback(async (facetData: any) => {
    try {
      const response = await apiService.createFacet(facetData)
      
      if (response.success && response.data) {
        // Agregar la nueva faceta a la lista
        setFacets(prev => [...prev, response.data])
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error creando faceta' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const updateFacet = useCallback(async (facetId: string, facetData: any) => {
    try {
      const response = await apiService.updateFacet(facetId, facetData)
      
      if (response.success && response.data) {
        // Actualizar la faceta en la lista
        setFacets(prev => prev.map(facet => 
          facet.id === facetId ? { ...facet, ...response.data } : facet
        ))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error actualizando faceta' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const deleteFacet = useCallback(async (facetId: string) => {
    try {
      const response = await apiService.deleteFacet(facetId)
      
      if (response.success) {
        // Remover la faceta de la lista
        setFacets(prev => prev.filter(facet => facet.id !== facetId))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error eliminando faceta' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const toggleFacet = useCallback(async (facetId: string) => {
    try {
      const response = await apiService.toggleFacet(facetId)
      
      if (response.success) {
        // Actualizar el estado activo de la faceta
        setFacets(prev => prev.map(facet => {
          if (facet.id === facetId) {
            return { ...facet, isActive: !facet.isActive }
          }
          return facet
        }))
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || 'Error cambiando faceta' }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [])

  const refreshFacets = useCallback(async () => {
    await loadFacets()
  }, [loadFacets])

  // Obtener faceta activa
  const activeFacet = facets.find(facet => facet.isActive) || null

  // Cargar facetas iniciales
  useEffect(() => {
    loadFacets()
  }, [loadFacets])

  return {
    facets,
    loading,
    error,
    activeFacet,
    createFacet,
    updateFacet,
    deleteFacet,
    toggleFacet,
    refreshFacets
  }
}


