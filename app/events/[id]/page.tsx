"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { apiService } from "@/lib/api"
import { Event } from "@/types"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Ticket,
  Share2,
  Heart,
  ArrowLeft,
  Globe,
  Lock,
  Play,
  ExternalLink,
  User,
  Tag,
  MessageCircle,
  Star
} from "lucide-react"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAttending, setIsAttending] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const eventId = params.id as string

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true)
        
        // Usar directamente el método que no incrementa vistas para evitar el error
        console.log('Loading event without incrementing views to avoid viewsCount error')
        const response = await apiService.getEventByIdWithoutIncrement(eventId)
        
        if (response.success && response.data) {
          setEvent(response.data)
          
          // Verificar si el usuario está registrado
          if (user && response.data.attendees) {
            const userAttendance = response.data.attendees.find(
              (attendee: any) => attendee.userId === user.id
            )
            setIsAttending(!!userAttendance)
          }
        } else {
          setError(response.message || 'Evento no encontrado')
        }
      } catch (err: any) {
        console.error('Error loading event:', err)
        setError(err.message || 'Error cargando evento')
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      loadEvent()
    }
  }, [eventId, user])

  const handleAttend = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para registrarte en eventos",
        variant: "destructive"
      })
      return
    }

    try {
      if (isAttending) {
        const response = await apiService.cancelAttendance(eventId)
        if (response.success) {
          setIsAttending(false)
          toast({
            title: "Asistencia cancelada",
            description: "Has cancelado tu asistencia al evento",
          })
        }
      } else {
        const response = await apiService.attendEvent(eventId)
        if (response.success) {
          setIsAttending(true)
          toast({
            title: "Registrado",
            description: "Te has registrado exitosamente en el evento",
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al procesar la solicitud",
        variant: "destructive"
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "URL copiada",
        description: "La URL del evento se ha copiado al portapapeles",
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

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Gratis"
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const getLocationText = () => {
    if (!event) return ""
    
    if (event.isOnline) {
      return event.onlineUrl ? "Evento en línea" : "Evento virtual"
    } else {
      return event.location?.address || event.location?.city || "Ubicación presencial"
    }
  }

  const getLocationIcon = () => {
    if (!event) return <MapPin className="w-4 h-4" />
    
    if (event.isOnline) {
      return <Video className="w-4 h-4" />
    } else {
      return <MapPin className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error cargando evento</h3>
          <p className="text-muted-foreground mb-4">{error || 'Evento no encontrado'}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const isUpcoming = (() => {
    try {
      const eventDate = new Date(event.startDate)
      return !isNaN(eventDate.getTime()) && eventDate > new Date()
    } catch (error) {
      return false
    }
  })()

  const isLive = (() => {
    try {
      const now = new Date()
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && 
             startDate <= now && endDate >= now
    } catch (error) {
      return false
    }
  })()

  const isSoldOut = event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen del Evento */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={event.image || event.banner || "/placeholder.svg"} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </div>
              )}
              {event.streaming?.enabled && (
                <Badge className="absolute top-4 right-4 bg-blue-500">
                  <Video className="w-3 h-3 mr-1" />
                  Streaming
                </Badge>
              )}
            </div>

            {/* Información del Evento */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{event.category}</Badge>
                      {event.isPublic ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Público
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Privado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Descripción */}
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {event.description || "No hay descripción disponible."}
                  </p>
                </div>

                {/* Detalles del Evento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fecha de inicio</p>
                      <p className="text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
                    </div>
                  </div>

                  {event.endDate && event.endDate !== event.startDate && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Fecha de fin</p>
                        <p className="text-sm text-muted-foreground">{formatDate(event.endDate)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {getLocationIcon()}
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">{getLocationText()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Asistentes</p>
                      <p className="text-sm text-muted-foreground">
                        {event.maxAttendees ? (
                          `${event.currentAttendees}/${event.maxAttendees}`
                        ) : (
                          `${event.currentAttendees}`
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL del Evento (si es online) */}
                {event.isOnline && event.onlineUrl && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Enlace del evento</p>
                      <a 
                        href={event.onlineUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline break-all"
                      >
                        {event.onlineUrl}
                      </a>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={event.onlineUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ir al evento
                      </a>
                    </Button>
                  </div>
                )}

                {/* Streaming */}
                {event.streaming?.enabled && event.streaming?.url && (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Streaming</p>
                      <p className="text-sm text-muted-foreground">
                        Plataforma: {event.streaming.platform}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={event.streaming.url} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-2" />
                        Ver stream
                      </a>
                    </Button>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ponentes */}
                {event.speakers && event.speakers.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Ponentes
                    </h3>
                    <div className="space-y-3">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={speaker.avatar} />
                            <AvatarFallback>
                              {speaker.name?.charAt(0).toUpperCase() || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{speaker.name}</p>
                            {speaker.bio && (
                              <p className="text-sm text-muted-foreground">{speaker.bio}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(event.price, event.currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.price === 0 ? "Evento gratuito" : "Precio por persona"}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {isSoldOut ? (
                      <Button disabled className="w-full">
                        <Ticket className="w-4 h-4 mr-2" />
                        Agotado
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleAttend}
                        className="w-full"
                        variant={isAttending ? "outline" : "default"}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {isAttending ? "Cancelar asistencia" : "Registrarse"}
                      </Button>
                    )}

                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir evento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizador */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={event.creator?.avatar} />
                    <AvatarFallback>
                      {event.creator?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.creator?.username || "Usuario"}</p>
                    <p className="text-sm text-muted-foreground">Organizador del evento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Espacio (si aplica) */}
            {event.space && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Espacio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={event.space.image} />
                      <AvatarFallback>
                        {event.space.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{event.space.name}</p>
                      <p className="text-sm text-muted-foreground">Espacio del evento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asistentes</span>
                  <span className="font-medium">{event.currentAttendees}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacidad</span>
                    <span className="font-medium">{event.maxAttendees}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge variant={isLive ? "destructive" : isUpcoming ? "default" : "secondary"}>
                    {isLive ? "En vivo" : isUpcoming ? "Próximo" : "Finalizado"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
