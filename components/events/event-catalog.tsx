"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Video, 
  Ticket,
  Star,
  TrendingUp,
  Plus,
  Play,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Globe,
  Monitor,
  Smartphone,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { EventCard } from "./event-card"
import { EventFilters } from "./event-filters"
import { EventCalendar } from "./event-calendar"
import { LiveEventsBanner } from "./live-events-banner"
import { CreateEventModal } from "./create-event-modal"
import { SimpleCreateEventModal } from "./simple-create-event-modal"
import { MinimalCreateEventModal } from "./minimal-create-event-modal"
import { CompleteCreateEventModal } from "./complete-create-event-modal"

interface EventCatalogProps {
  spaceId?: string
  organizerId?: string
  categoryId?: string
}

export function EventCatalog({ spaceId, organizerId, categoryId }: EventCatalogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { events, loading, error, loadEvents, getSpaceEvents, attendEvent, cancelAttendance } = useEvents()
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filters, setFilters] = useState({
    freeOnly: false,
    liveStream: false,
    virtualOnly: false,
    physicalOnly: false,
    upcomingOnly: false,
    minRating: 0,
    tags: [] as string[]
  })

  // Función para recargar eventos
  const handleRefreshEvents = async () => {
    console.log('Manually refreshing events...')
    if (spaceId) {
      await getSpaceEvents(spaceId)
    } else {
      await loadEvents()
    }
  }

  // Categorías de eventos del backend
  const eventCategories = [
    { id: "conference", name: "Conferencia", icon: "🎤" },
    { id: "workshop", name: "Taller", icon: "🔧" },
    { id: "meetup", name: "Meetup", icon: "🤝" },
    { id: "concert", name: "Concierto", icon: "🎵" },
    { id: "exhibition", name: "Exposición", icon: "🖼️" },
    { id: "sports", name: "Deportes", icon: "⚽" },
    { id: "other", name: "Otro", icon: "📅" }
  ]

  // Load events based on props
  useEffect(() => {
    if (spaceId) {
      getSpaceEvents(spaceId)
    } else {
      loadEvents()
    }
  }, [spaceId, loadEvents, getSpaceEvents])

  // Update filtered events when events change
  useEffect(() => {
    setFilteredEvents(events)
  }, [events])

  // Apply filters
  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(event => {
        try {
          const eventDate = new Date(event.startDate)
          return !isNaN(eventDate.getTime()) && eventDate.toDateString() === selectedDate.toDateString()
        } catch (error) {
          console.error('Error filtering by date:', error, 'Event start date:', event.startDate)
          return false
        }
      })
    }

    // Free only filter
    if (filters.freeOnly) {
      filtered = filtered.filter(event => event.price === 0)
    }

    // Live stream filter
    if (filters.liveStream) {
      filtered = filtered.filter(event => event.streaming?.enabled)
    }

    // Virtual only filter
    if (filters.virtualOnly) {
      filtered = filtered.filter(event => event.isOnline)
    }

    // Physical only filter
    if (filters.physicalOnly) {
      filtered = filtered.filter(event => !event.isOnline)
    }

    // Upcoming only filter
    if (filters.upcomingOnly) {
      filtered = filtered.filter(event => {
        try {
          const eventDate = new Date(event.startDate)
          return !isNaN(eventDate.getTime()) && eventDate > new Date()
        } catch (error) {
          console.error('Error filtering upcoming events:', error, 'Event start date:', event.startDate)
          return false
        }
      })
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedCategory, selectedDate, filters])

  const handleRSVP = async (eventId: string) => {
    try {
      const result = await attendEvent(eventId)
      if (result.success) {
        toast({
          title: "RSVP enviado",
          description: "Te has registrado para el evento",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al registrarse en el evento",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al registrarse en el evento",
        variant: "destructive"
      })
    }
  }

  const handleCancelRSVP = async (eventId: string) => {
    try {
      const result = await cancelAttendance(eventId)
      if (result.success) {
        toast({
          title: "Asistencia cancelada",
          description: "Has cancelado tu asistencia al evento",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al cancelar asistencia",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cancelar asistencia",
        variant: "destructive"
      })
    }
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida'
      }
      
      return new Intl.DateTimeFormat('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date)
      return 'Fecha inválida'
    }
  }

  // Filtrar eventos en vivo y próximos
  const liveEvents = events.filter(event => {
    try {
      const now = new Date()
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && 
             startDate <= now && endDate >= now
    } catch (error) {
      console.error('Error filtering live events:', error, 'Event dates:', event.startDate, event.endDate)
      return false
    }
  })

  const upcomingEvents = events.filter(event => {
    try {
      const now = new Date()
      const startDate = new Date(event.startDate)
      return !isNaN(startDate.getTime()) && startDate > now
    } catch (error) {
      console.error('Error filtering upcoming events:', error, 'Event start date:', event.startDate)
      return false
    }
  })

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error cargando eventos</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => loadEvents()}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full space-y-6">
      {/* Live Events Banner */}
      {liveEvents.length > 0 && (
        <LiveEventsBanner events={liveEvents} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {spaceId ? "Eventos del Espacio" : "Eventos"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredEvents.length} eventos encontrados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
              </div>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <div className="flex flex-col gap-1 w-4 h-4">
                <div className="bg-current rounded-sm h-1" />
                <div className="bg-current rounded-sm h-1" />
                <div className="bg-current rounded-sm h-1" />
              </div>
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshEvents}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
            
            <CompleteCreateEventModal spaceId={spaceId}>
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Button>
            </CompleteCreateEventModal>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="">Todos</TabsTrigger>
            {eventCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventFilters
                filters={filters}
                onFiltersChange={setFilters}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Events Display */}
      {viewMode === "calendar" ? (
        <EventCalendar 
          events={filteredEvents}
          onEventClick={(event) => console.log("Event clicked:", event)}
        />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron eventos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <EventCard
                  event={event}
                  viewMode={viewMode}
                  onRSVP={handleRSVP}
                  onCancelRSVP={handleCancelRSVP}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
