"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { useSpaces } from "@/hooks/useSpaces"
import { Calendar, MapPin, Video, Users, Tag, Plus, X, Globe, Lock } from "lucide-react"

interface CreateEventModalProps {
  children?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  spaceId?: string
}

const eventTypes = [
  { value: "online", label: "En línea", icon: "💻" },
  { value: "offline", label: "Presencial", icon: "📍" },
  { value: "hybrid", label: "Híbrido", icon: "🔄" }
]

const eventCategories = [
  { value: "conference", label: "Conferencia", icon: "🎤" },
  { value: "workshop", label: "Taller", icon: "🔧" },
  { value: "meetup", label: "Meetup", icon: "🤝" },
  { value: "concert", label: "Concierto", icon: "🎵" },
  { value: "exhibition", label: "Exposición", icon: "🖼️" },
  { value: "sports", label: "Deportes", icon: "⚽" },
  { value: "other", label: "Otro", icon: "📅" }
]

export function CreateEventModal({ children, isOpen, onClose, spaceId }: CreateEventModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Debug: Log cuando el modal se abre
  console.log('CreateEventModal render:', { open, isOpen, children: !!children })
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "online" as "online" | "offline" | "hybrid",
    category: "other" as "conference" | "workshop" | "meetup" | "concert" | "exhibition" | "sports" | "other",
    startDate: "",
    endDate: "",
    timezone: "UTC",
    location: {
      address: "",
      city: "",
      country: "",
      coordinates: null
    },
    onlineUrl: "",
    isOnline: true,
    isPublic: true,
    maxAttendees: "",
    price: "0",
    currency: "USD",
    tags: [] as string[],
    tagInput: "",
    speakers: [] as any[],
    speakerInput: "",
    streaming: {
      enabled: false,
      platform: "",
      url: ""
    }
  })

  const { toast } = useToast()
  const { createEvent } = useEvents()
  const { spaces } = useSpaces()

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setOpen(false)
    }
    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "online",
      category: "other",
      startDate: "",
      endDate: "",
      timezone: "UTC",
      location: {
        address: "",
        city: "",
        country: "",
        coordinates: null
      },
      onlineUrl: "",
      isOnline: true,
      isPublic: true,
      maxAttendees: "",
      price: "0",
      currency: "USD",
      tags: [],
      tagInput: "",
      speakers: [],
      speakerInput: "",
      streaming: {
        enabled: false,
        platform: "",
        url: ""
      }
    })
  }

  const modalOpen = isOpen !== undefined ? isOpen : open

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Modal open change:', newOpen)
    if (onClose && !newOpen) {
      onClose()
    } else if (isOpen === undefined) {
      setOpen(newOpen)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend (coinciden con el backend)
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título del evento es requerido",
        variant: "destructive"
      })
      return
    }
    
    if (formData.title.length < 3) {
      toast({
        title: "Error",
        description: "El título debe tener al menos 3 caracteres",
        variant: "destructive"
      })
      return
    }
    
    if (formData.title.length > 200) {
      toast({
        title: "Error",
        description: "El título no puede exceder 200 caracteres",
        variant: "destructive"
      })
      return
    }
    
    if (formData.description.length > 2000) {
      toast({
        title: "Error",
        description: "La descripción no puede exceder 2000 caracteres",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.startDate) {
      toast({
        title: "Error",
        description: "La fecha de inicio es requerida",
        variant: "destructive"
      })
      return
    }
    
    if (formData.tags.length > 10) {
      toast({
        title: "Error",
        description: "No puedes tener más de 10 tags",
        variant: "destructive"
      })
      return
    }
    
    if (formData.maxAttendees && (parseInt(formData.maxAttendees) < 1 || parseInt(formData.maxAttendees) > 10000)) {
      toast({
        title: "Error",
        description: "El máximo de asistentes debe ser entre 1-10000",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        timezone: formData.timezone,
        location: formData.location,
        onlineUrl: formData.onlineUrl,
        isOnline: formData.isOnline,
        isPublic: formData.isPublic,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        price: parseFloat(formData.price),
        currency: formData.currency,
        tags: formData.tags,
        speakers: formData.speakers,
        streaming: formData.streaming,
        spaceId: spaceId || null
      }
      
      console.log("Enviando datos del evento:", eventData)
      const result = await createEvent(eventData)

      if (result.success) {
        toast({
          title: "Evento creado",
          description: result.message || "Evento creado exitosamente",
        })
        handleClose()
      } else {
        toast({
          title: "Error",
          description: result.message || "Error creando el evento",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: error.message || "Error de conexión",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (formData.tagInput.trim() && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ""
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addSpeaker = () => {
    if (formData.speakerInput.trim()) {
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, { name: prev.speakerInput.trim(), bio: "", avatar: "" }],
        speakerInput: ""
      }))
    }
  }

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }))
  }

  const selectedType = eventTypes.find(type => type.value === formData.type)
  const selectedCategory = eventCategories.find(cat => cat.value === formData.category)

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Crear Nuevo Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento *</Label>
                <Input
                  id="title"
                  placeholder="Nombre del evento"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.title.length}/200 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu evento..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={2000}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.description.length}/2000 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Evento</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <span className="mr-2">{category.icon}</span>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas y Horarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fechas y Horarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                    <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOnline: checked }))}
                />
                <Label htmlFor="isOnline">Evento en línea</Label>
              </div>

              {formData.isOnline ? (
                <div className="space-y-2">
                  <Label htmlFor="onlineUrl">URL del Evento</Label>
                  <Input
                    id="onlineUrl"
                    placeholder="https://meet.google.com/..."
                    value={formData.onlineUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, onlineUrl: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      placeholder="Dirección completa"
                      value={formData.location.address}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        placeholder="Ciudad"
                        value={formData.location.city}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, city: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        placeholder="País"
                        value={formData.location.country}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, country: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración del Evento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="isPublic" className="flex items-center gap-2">
                  {formData.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  Evento público
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Máximo de Asistentes</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="Sin límite"
                    min="1"
                    max="10000"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <div className="flex gap-2">
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar tag"
                  value={formData.tagInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={!formData.tagInput.trim() || formData.tags.length >= 10}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {formData.tags.length}/10 tags
              </p>
            </CardContent>
          </Card>

          {/* Ponentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ponentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del ponente"
                  value={formData.speakerInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, speakerInput: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpeaker())}
                />
                <Button type="button" onClick={addSpeaker} disabled={!formData.speakerInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.speakers.length > 0 && (
                <div className="space-y-2">
                  {formData.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{speaker.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpeaker(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streaming */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5" />
                Streaming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="streamingEnabled"
                  checked={formData.streaming.enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    streaming: { ...prev.streaming, enabled: checked }
                  }))}
                />
                <Label htmlFor="streamingEnabled">Habilitar streaming</Label>
              </div>

              {formData.streaming.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="streamingPlatform">Plataforma de Streaming</Label>
                    <Select 
                      value={formData.streaming.platform} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        streaming: { ...prev.streaming, platform: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitch">Twitch</SelectItem>
                        <SelectItem value="facebook">Facebook Live</SelectItem>
                        <SelectItem value="instagram">Instagram Live</SelectItem>
                        <SelectItem value="other">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streamingUrl">URL de Streaming</Label>
                    <Input
                      id="streamingUrl"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.streaming.url}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        streaming: { ...prev.streaming, url: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
