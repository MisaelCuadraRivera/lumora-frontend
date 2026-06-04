"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Ticket,
  Star,
  Heart,
  Share2,
  Play,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Plus,
  Minus,
  Edit3,
  Trash2,
  User
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import type { Event } from "@/types"
import { getMediaUrl } from "@/lib/mediaService"
import { EditEventModal } from "./edit-event-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const categoryTranslations: Record<string, string> = {
  conference: "Conferencia",
  workshop: "Taller",
  meetup: "Meetup",
  concert: "Concierto",
  exhibition: "Exposición",
  sports: "Deportes",
  other: "Otro"
}

const translateTagOrCategory = (val: string) => {
  if (!val) return ""
  const lower = val.toLowerCase().trim()
  return categoryTranslations[lower] || val
}

interface EventCardProps {
  event: Event
  viewMode: "grid" | "list"
  onRSVP: (eventId: string) => void
  onCancelRSVP?: (eventId: string) => void
  onDelete?: (eventId: string) => void
  onUpdate?: () => void
}

export function EventCard({ event, viewMode, onRSVP, onCancelRSVP, onDelete, onUpdate }: EventCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { deleteEvent } = useEvents({ autoFetch: false })
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(() => {
    if (!user || !event.attendees) return false
    return event.attendees.some((attendee: any) => (attendee.userId || attendee.id) === user.id)
  })
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (user && event.attendees) {
      const userAttendance = event.attendees.some(
        (attendee: any) => (attendee.userId || attendee.id) === user.id
      )
      setIsRegistered(userAttendance)
    } else {
      setIsRegistered(false)
    }
  }, [user, event.attendees])

  const isCreator = !!(user && (user.id === event.userId || user.id === event.creator?.id))

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await deleteEvent(event.id)
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Evento eliminado correctamente",
        })
        if (onDelete) {
          onDelete(event.id)
        }
      } else {
        throw new Error(response.message || "Error al eliminar el evento")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar el evento",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/events/${event.id}`)
  }

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se active el click de la tarjeta
    
    if (isCreator) {
      toast({
        title: "Acción denegada",
        description: "Como organizador del evento, no puedes registrarte como asistente.",
        variant: "destructive"
      })
      return
    }

    if (isRegistered && onCancelRSVP) {
      onCancelRSVP(event.id)
    } else {
      onRSVP(event.id)
    }
    setIsRegistered(!isRegistered)
  }

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida'
      }
      
      return new Intl.DateTimeFormat('es-MX', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date)
      return 'Fecha inválida'
    }
  }

  const formatPrice = (priceInput: any, currencyInput: string) => {
    const price = typeof priceInput === 'string' ? parseFloat(priceInput) : priceInput
    if (price === undefined || price === null || isNaN(price) || price === 0) return "Gratis"
    
    // Normalize currency to uppercase and trim spaces
    const currency = (currencyInput || 'MXN').trim().toUpperCase()
    
    try {
      const formattedPrice = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
      }).format(price)
      
      // If it's MXN, make sure it says MXN to avoid confusion with USD/other currencies using $
      if (currency === 'MXN') {
        return `${formattedPrice} MXN`
      }
      return formattedPrice
    } catch (e) {
      console.error('Error formatting price in EventCard:', e)
      return `${currency} ${price.toFixed(2)}`
    }
  }

  const getLocationIcon = () => {
    switch (event.location.type) {
      case "virtual":
        return <Monitor className="w-4 h-4" />
      case "physical":
        return <MapPin className="w-4 h-4" />
      case "hybrid":
        return <Globe className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getLocationText = () => {
    switch (event.location.type) {
      case "virtual":
        return "Virtual"
      case "physical":
        return event.location.city || "Presencial"
      case "hybrid":
        return "Híbrido"
      default:
        return "Presencial"
    }
  }

  const isLive = event.streaming?.enabled && event.streaming?.url
  const isUpcoming = (() => {
    try {
      const eventDate = new Date(event.startDate)
      return !isNaN(eventDate.getTime()) && eventDate > new Date()
    } catch (error) {
      console.error('Error comparing dates:', error, 'Start date:', event.startDate)
      return false
    }
  })()
  const isSoldOut = event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false

  if (viewMode === "list") {
    return (
      <>
      <Card 
        className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
            {/* Event Image */}
            <div className="relative w-full sm:w-48 h-48 sm:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={getMediaUrl(event.banner || event.image)} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {isLive && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </div>
              )}
              {event.streaming?.enabled && (
                <Badge className="absolute top-2 right-2 bg-blue-500">
                  <Video className="w-3 h-3 mr-1" />
                  Streaming
                </Badge>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
                className={`absolute bottom-2 right-2 bg-background/80 hover:bg-background/90 ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                    >
                      {translateTagOrCategory(event.category)}
                    </Badge>
                    {isLive && (
                      <Badge variant="destructive">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                        EN VIVO
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getLocationIcon()}
                  <span className="text-sm truncate">{getLocationText()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">
                    {event.maxAttendees ? (
                      `${event.currentAttendees}/${event.maxAttendees} asistentes`
                    ) : (
                      `${event.currentAttendees} asistentes`
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {formatPrice(event.price, event.currency)}
                  </span>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="flex flex-wrap items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={getMediaUrl(event.creator?.avatar)} />
                  <AvatarFallback className="text-xs">
                    {event.creator?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground truncate">
                  {event.creator?.username || "Usuario"}
                </span>
                {event.space && (
                  <>
                    <span className="text-muted-foreground text-xs">•</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {event.space.name}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {translateTagOrCategory(tag)}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 3} más
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/10">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast({
                        title: "Compartido",
                        description: "Evento compartido en tus redes",
                      })
                    }}
                    className="flex-1 sm:flex-initial"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartir
                  </Button>
                  {isLive && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(event.streaming?.url, '_blank')
                      }}
                      className="flex-1 sm:flex-initial"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Ver en vivo
                    </Button>
                  )}
                  {isCreator && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditModalOpen(true)
                        }}
                        className="flex-1 sm:flex-initial border-primary/30 hover:bg-primary/5 text-primary hover:text-primary-foreground/90"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteDialogOpen(true)
                        }}
                        className="flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </>
                  )}
                </div>

                {isCreator ? (
                  <Button
                    type="button"
                    disabled
                    className="w-full sm:w-auto cursor-not-allowed border-muted-foreground/30 text-muted-foreground"
                    variant="outline"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Eres el organizador
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleRSVP}
                    disabled={isSoldOut && !isRegistered}
                    className={`w-full sm:w-auto ${
                      isRegistered 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    {isRegistered ? "Registrado" : isSoldOut ? "Agotado" : "RSVP"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditEventModal
        event={event}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={onUpdate}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el evento "{event.title}" y todos sus asistentes asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(false)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    )
  }

  // Grid View
    return (
      <>
      <Card 
        className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          {/* Event Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-4">
            <img 
              src={getMediaUrl(event.banner || event.image)} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isLive && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                EN VIVO
              </div>
            )}
            {event.streaming?.enabled && (
              <Badge className="absolute top-2 right-2 bg-blue-500">
                <Video className="w-3 h-3 mr-1" />
                Streaming
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
              className={`absolute bottom-2 right-2 bg-background/80 hover:bg-background/90 ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Event Info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline"
                  className="text-xs"
                >
                  {translateTagOrCategory(event.category)}
                </Badge>
                {isLive && (
                  <Badge variant="destructive" className="text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                    EN VIVO
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getLocationIcon()}
                <span className="text-sm">{getLocationText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.maxAttendees ? (
                    `${event.currentAttendees}/${event.maxAttendees}`
                  ) : (
                    `${event.currentAttendees}`
                  )}
                </span>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={getMediaUrl(event.creator?.avatar)} />
                <AvatarFallback className="text-xs">
                  {event.creator?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {event.creator?.username || "Usuario"}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {translateTagOrCategory(tag)}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* Price and Actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(event.price, event.currency)}
                </span>
                {isSoldOut && (
                  <Badge variant="destructive" className="text-xs">
                    Agotado
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {isLive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(event.streamUrl, '_blank')
                    }}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Ver en vivo
                  </Button>
                )}
                {isCreator ? (
                  <Button
                    disabled
                    className="flex-1 cursor-not-allowed border-muted-foreground/30 text-muted-foreground"
                    variant="outline"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Eres el organizador
                  </Button>
                ) : (
                  <Button
                    onClick={handleRSVP}
                    disabled={isSoldOut && !isRegistered}
                    className={`flex-1 ${
                      isRegistered 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    <Ticket className="w-4 h-4 mr-1" />
                    {isRegistered ? "Registrado" : isSoldOut ? "Agotado" : "RSVP"}
                  </Button>
                )}
              </div>

              {isCreator && (
                <div className="flex gap-2 pt-2 border-t border-border/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditModalOpen(true)
                    }}
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/5 h-8 text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteDialogOpen(true)
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white h-8 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <EditEventModal
        event={event}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={onUpdate}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el evento "{event.title}" y todos sus asistentes asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(false)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    )
}
