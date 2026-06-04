"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Play, 
  Users, 
  Video, 
  Clock,
  ArrowRight
} from "lucide-react"
import type { Event } from "@/types"
import { getMediaUrl } from "@/lib/mediaService"

interface LiveEventsBannerProps {
  events: Event[]
}

export function LiveEventsBanner({ events }: LiveEventsBannerProps) {
  const formatTime = (dateInput: Date | string) => {
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
      if (!date || isNaN(date.getTime())) {
        return ''
      }
      return new Intl.DateTimeFormat('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (error) {
      console.error('Error formatting time:', error, 'Date value:', dateInput)
      return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg bg-red-500 p-1"
    >
      <div className="relative bg-background rounded-lg p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-red-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-red-600">
                  EN VIVO AHORA
                </h2>
              </div>
              <Badge variant="destructive" className="animate-pulse">
                {events.length} evento{events.length !== 1 ? 's' : ''} en vivo
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Event Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={getMediaUrl(event.image || event.banner)} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-red-500/20" />
                        <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {event.currentViewers || 0} viendo
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(event.startDate)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => window.open(event.streamUrl, '_blank')}
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Unirse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {events.length > 3 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Y {events.length - 3} evento{events.length - 3 !== 1 ? 's' : ''} más en vivo
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
