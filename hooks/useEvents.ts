"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'
import { Event } from '@/types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async (page = 1, limit = 20, filters: any = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getPublicEvents(page, limit, filters)
      console.log('Response from getPublicEvents:', response)
      if (response.success && response.data) {
        const eventsData = response.data.events || response.data
        console.log('Events data:', eventsData)
        setEvents(Array.isArray(eventsData) ? eventsData : [])
      } else {
        console.error('Error loading events:', response.message)
        setError(response.message || 'Error cargando eventos')
      }
    } catch (err: any) {
      console.error('Error in loadEvents:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUserEvents = useCallback(async (page = 1, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getUserEvents(page, limit)
      console.log('Response from getUserEvents:', response)
      if (response.success && response.data) {
        const eventsData = response.data.events || response.data
        console.log('User events data:', eventsData)
        setEvents(Array.isArray(eventsData) ? eventsData : [])
      } else {
        console.error('Error loading user events:', response.message)
        setError(response.message || 'Error cargando eventos del usuario')
      }
    } catch (err: any) {
      console.error('Error in loadUserEvents:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (eventData: any) => {
    try {
      const response = await apiService.createEvent(eventData)
      if (response.success) {
        // Recargar eventos después de crear uno nuevo
        await loadEvents()
        return response
      } else {
        throw new Error(response.message || 'Error creando evento')
      }
    } catch (err: any) {
      console.error('Error creating event:', err)
      throw err
    }
  }, [loadEvents])

  const updateEvent = useCallback(async (eventId: string, eventData: any) => {
    try {
      const response = await apiService.updateEvent(eventId, eventData)
      if (response.success) {
        // Actualizar el evento en la lista local
        setEvents(prev => prev.map(event => 
          event.id === eventId ? { ...event, ...eventData } : event
        ))
        return response
      } else {
        throw new Error(response.message || 'Error actualizando evento')
      }
    } catch (err: any) {
      console.error('Error updating event:', err)
      throw err
    }
  }, [])

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      const response = await apiService.deleteEvent(eventId)
      if (response.success) {
        // Remover el evento de la lista local
        setEvents(prev => prev.filter(event => event.id !== eventId))
        return response
      } else {
        throw new Error(response.message || 'Error eliminando evento')
      }
    } catch (err: any) {
      console.error('Error deleting event:', err)
      throw err
    }
  }, [])

  const attendEvent = useCallback(async (eventId: string) => {
    try {
      const response = await apiService.attendEvent(eventId)
      if (response.success) {
        // Actualizar el contador de asistentes en la lista local
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: event.currentAttendees + 1 }
            : event
        ))
        return response
      } else {
        throw new Error(response.message || 'Error registrándose en el evento')
      }
    } catch (err: any) {
      console.error('Error attending event:', err)
      throw err
    }
  }, [])

  const cancelAttendance = useCallback(async (eventId: string) => {
    try {
      const response = await apiService.cancelAttendance(eventId)
      if (response.success) {
        // Actualizar el contador de asistentes en la lista local
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, currentAttendees: Math.max(0, event.currentAttendees - 1) }
            : event
        ))
        return response
      } else {
        throw new Error(response.message || 'Error cancelando asistencia')
      }
    } catch (err: any) {
      console.error('Error canceling attendance:', err)
      throw err
    }
  }, [])

  const searchEvents = useCallback(async (query: string, page = 1, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.searchEvents(query, page, limit)
      if (response.success && response.data) {
        const eventsData = response.data.events || response.data
        setEvents(Array.isArray(eventsData) ? eventsData : [])
      } else {
        setError(response.message || 'Error buscando eventos')
      }
    } catch (err: any) {
      console.error('Error searching events:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const getSpaceEvents = useCallback(async (spaceId: string, page = 1, limit = 20) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getSpaceEvents(spaceId, page, limit)
      if (response.success && response.data) {
        const eventsData = response.data.events || response.data
        setEvents(Array.isArray(eventsData) ? eventsData : [])
      } else {
        setError(response.message || 'Error cargando eventos del espacio')
      }
    } catch (err: any) {
      console.error('Error loading space events:', err)
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  const getCalendarEvents = useCallback(async (startDate: string, endDate: string) => {
    try {
      const response = await apiService.getCalendarEvents(startDate, endDate)
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Error cargando calendario')
      }
    } catch (err: any) {
      console.error('Error loading calendar events:', err)
      throw err
    }
  }, [])

  // Cargar eventos públicos por defecto
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  return {
    events,
    loading,
    error,
    loadEvents,
    loadUserEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    cancelAttendance,
    searchEvents,
    getSpaceEvents,
    getCalendarEvents
  }
}
