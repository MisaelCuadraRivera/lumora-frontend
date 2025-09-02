"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Globe,
  Monitor,
  MapPin,
  Video,
  Ticket,
  Tag
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface EventFiltersProps {
  filters: {
    freeOnly: boolean
    liveStream: boolean
    virtualOnly: boolean
    physicalOnly: boolean
    upcomingOnly: boolean
    minRating: number
    tags: string[]
  }
  onFiltersChange: (filters: any) => void
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
}

const popularTags = [
  "arte digital", "taller", "conferencia", "música", "networking", 
  "tecnología", "creatividad", "comunidad", "virtual", "presencial"
]

export function EventFilters({ 
  filters, 
  onFiltersChange, 
  selectedDate, 
  onDateChange 
}: EventFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    handleFilterChange("tags", newTags)
  }

  const clearFilters = () => {
    onFiltersChange({
      freeOnly: false,
      liveStream: false,
      virtualOnly: false,
      physicalOnly: false,
      upcomingOnly: false,
      minRating: 0,
      tags: []
    })
    onDateChange(null)
  }

  const activeFiltersCount = [
    filters.freeOnly,
    filters.liveStream,
    filters.virtualOnly,
    filters.physicalOnly,
    filters.upcomingOnly,
    filters.minRating > 0,
    filters.tags.length > 0,
    selectedDate !== null
  ].filter(Boolean).length

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Fecha específica</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filtros rápidos</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-green-500" />
                <Label htmlFor="free-only" className="text-sm">Solo eventos gratis</Label>
              </div>
              <Switch
                id="free-only"
                checked={filters.freeOnly}
                onCheckedChange={(checked) => handleFilterChange("freeOnly", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500" />
                <Label htmlFor="live-stream" className="text-sm">Con streaming en vivo</Label>
              </div>
              <Switch
                id="live-stream"
                checked={filters.liveStream}
                onCheckedChange={(checked) => handleFilterChange("liveStream", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <Label htmlFor="virtual-only" className="text-sm">Solo eventos virtuales</Label>
              </div>
              <Switch
                id="virtual-only"
                checked={filters.virtualOnly}
                onCheckedChange={(checked) => handleFilterChange("virtualOnly", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <Label htmlFor="physical-only" className="text-sm">Solo eventos presenciales</Label>
              </div>
              <Switch
                id="physical-only"
                checked={filters.physicalOnly}
                onCheckedChange={(checked) => handleFilterChange("physicalOnly", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-red-500" />
                <Label htmlFor="upcoming-only" className="text-sm">Solo eventos próximos</Label>
              </div>
              <Switch
                id="upcoming-only"
                checked={filters.upcomingOnly}
                onCheckedChange={(checked) => handleFilterChange("upcomingOnly", checked)}
              />
            </div>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Etiquetas populares</Label>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Button
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Location Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tipo de ubicación</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={filters.virtualOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("virtualOnly", !filters.virtualOnly)}
              className="flex items-center gap-1"
            >
              <Monitor className="w-3 h-3" />
              Virtual
            </Button>
            <Button
              variant={filters.physicalOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("physicalOnly", !filters.physicalOnly)}
              className="flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Presencial
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              Híbrido
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
