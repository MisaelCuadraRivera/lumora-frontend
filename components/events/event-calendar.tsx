"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Video,
  Play
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns"
import { es } from "date-fns/locale"
import type { Event } from "@/types"

interface EventCalendarProps {
  events: Event[]
  onEventClick: (event: Event) => void
}

export function EventCalendar({ events, onEventClick }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startDate), date))
  }

  const formatDate = (date: Date) => {
    return format(date, "HH:mm")
  }

  const getLocationIcon = (event: Event) => {
    switch (event.location.type) {
      case "virtual":
        return <Video className="w-3 h-3" />
      case "physical":
        return <MapPin className="w-3 h-3" />
      case "hybrid":
        return <div className="flex gap-0.5">
          <MapPin className="w-2 h-2" />
          <Video className="w-2 h-2" />
        </div>
      default:
        return <MapPin className="w-3 h-3" />
    }
  }

  const isLive = (event: Event) => {
    const now = new Date()
    return event.startDate <= now && event.endDate >= now && event.streamStatus === "live"
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const prevMonth = new Date(currentDate)
                prevMonth.setMonth(prevMonth.getMonth() - 1)
                setCurrentDate(prevMonth)
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextMonth = new Date(currentDate)
                nextMonth.setMonth(nextMonth.getMonth() + 1)
                setCurrentDate(nextMonth)
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Ir a fecha
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentDate)

              return (
                <motion.div
                  key={day.toISOString()}
                  className={`
                    min-h-[120px] p-2 border border-border/50 rounded-lg
                    ${isCurrentMonth ? "bg-background" : "bg-muted/30"}
                    ${isToday ? "ring-2 ring-primary/20" : ""}
                    ${dayEvents.length > 0 ? "bg-primary/5" : ""}
                    hover:bg-muted/50 transition-colors cursor-pointer
                  `}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Day Number */}
                  <div className="text-right mb-1">
                    <span className={`
                      text-sm font-medium
                      ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}
                      ${!isCurrentMonth ? "text-muted-foreground" : ""}
                    `}>
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <motion.div
                        key={event.id}
                        className="text-xs p-1 rounded bg-card border border-border/50 hover:bg-accent cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {getLocationIcon(event)}
                          <span className="font-medium truncate">
                            {formatDate(new Date(event.startDate))}
                          </span>
                          {isLive(event) && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {event.title}
                        </div>
                      </motion.div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Eventos del {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(null)}
            >
              Cerrar
            </Button>
          </div>

          <div className="grid gap-4">
            {getEventsForDate(selectedDate).map((event) => (
              <Card key={event.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={event.coverImage || event.images[0] || "/placeholder.svg"} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {isLive(event) && (
                        <div className="absolute top-1 left-1 flex items-center gap-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                          EN VIVO
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(new Date(event.startDate))}
                        </div>
                        <div className="flex items-center gap-1">
                          {getLocationIcon(event)}
                          {event.location.type === "virtual" ? "Virtual" : event.location.city || "Presencial"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.currentAttendees}/{event.capacity}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {isLive(event) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => window.open(event.streamUrl, '_blank')}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Ver en vivo
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEventClick(event)}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
