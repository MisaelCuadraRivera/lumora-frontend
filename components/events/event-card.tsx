"use client"

import { useState } from "react"
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
  Minus
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/types"

interface EventCardProps {
  event: Event
  viewMode: "grid" | "list"
  onRSVP: (eventId: string) => void
  onLike: (eventId: string) => void
}

export function EventCard({ event, viewMode, onRSVP, onLike }: EventCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRSVP = () => {
    setIsRegistered(!isRegistered)
    onRSVP(event.id)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(event.id)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Gratis"
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
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

  const isLive = event.streamStatus === "live"
  const isUpcoming = event.startDate > new Date()
  const isSoldOut = event.currentAttendees >= event.capacity

  if (viewMode === "list") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Event Image */}
            <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-muted">
              <img 
                src={event.coverImage || event.images[0] || "/placeholder.svg"} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {isLive && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </div>
              )}
              {event.isLiveStream && (
                <Badge className="absolute top-2 right-2 bg-blue-500">
                  <Video className="w-3 h-3 mr-1" />
                  Streaming
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`absolute bottom-2 right-2 bg-background/80 hover:bg-background/90 ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: event.category.color, color: event.category.color }}
                    >
                      {event.category.icon} {event.category.name}
                    </Badge>
                    {isLive && (
                      <Badge variant="destructive">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                        EN VIVO
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 mb-3">
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
                    {event.currentAttendees}/{event.capacity} asistentes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatPrice(event.price, event.currency)}
                  </span>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={event.organizer.avatar} />
                  <AvatarFallback className="text-xs">
                    {event.organizer.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {event.organizer.username}
                </span>
                {event.space && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {event.space.name}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {event.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.tags.length - 3} más
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({
                      title: "Compartido",
                      description: "Evento compartido en tus redes",
                    })}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartir
                  </Button>
                  {isLive && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => window.open(event.streamUrl, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Ver en vivo
                    </Button>
                  )}
                </div>

                <Button
                  onClick={handleRSVP}
                  disabled={isSoldOut && !isRegistered}
                  className={`${
                    isRegistered 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  }`}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  {isRegistered ? "Registrado" : isSoldOut ? "Agotado" : "RSVP"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group">
      <CardContent className="p-4">
        {/* Event Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-4">
          <img 
            src={event.coverImage || event.images[0] || "/placeholder.svg"} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              EN VIVO
            </div>
          )}
          {event.isLiveStream && (
            <Badge className="absolute top-2 right-2 bg-blue-500">
              <Video className="w-3 h-3 mr-1" />
              Streaming
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
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
                style={{ borderColor: event.category.color, color: event.category.color }}
                className="text-xs"
              >
                {event.category.icon} {event.category.name}
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
                {event.currentAttendees}/{event.capacity}
              </span>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={event.organizer.avatar} />
              <AvatarFallback className="text-xs">
                {event.organizer.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {event.organizer.username}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
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
                  onClick={() => window.open(event.streamUrl, '_blank')}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Ver en vivo
                </Button>
              )}
              <Button
                onClick={handleRSVP}
                disabled={isSoldOut && !isRegistered}
                className={`flex-1 ${
                  isRegistered 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                }`}
              >
                <Ticket className="w-4 h-4 mr-1" />
                {isRegistered ? "Registrado" : isSoldOut ? "Agotado" : "RSVP"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
