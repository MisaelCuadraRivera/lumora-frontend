"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { Calendar, Plus } from "lucide-react"

interface CompleteCreateEventModalProps {
  children?: React.ReactNode
  spaceId?: string
}

const eventTypes = [
  { value: "online", label: "En línea" },
  { value: "offline", label: "Presencial" },
  { value: "hybrid", label: "Híbrido" }
]

const eventCategories = [
  { value: "conference", label: "Conferencia" },
  { value: "workshop", label: "Taller" },
  { value: "meetup", label: "Meetup" },
  { value: "concert", label: "Concierto" },
  { value: "exhibition", label: "Exposición" },
  { value: "sports", label: "Deportes" },
  { value: "other", label: "Otro" }
]

export function CompleteCreateEventModal({ children, spaceId }: CompleteCreateEventModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "online" as "online" | "offline" | "hybrid",
    category: "other" as "conference" | "workshop" | "meetup" | "concert" | "exhibition" | "sports" | "other",
    startDate: "",
    endDate: "",
    location: "",
    onlineUrl: "",
    isOnline: true,
    isPublic: true,
    maxAttendees: "",
    price: "0",
    currency: "USD"
  })

  const { toast } = useToast()
  const { createEvent } = useEvents()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es requerido",
        variant: "destructive"
      })
      return
    }

    if (formData.title.trim().length < 3) {
      toast({
        title: "Error",
        description: "El título debe tener al menos 3 caracteres",
        variant: "destructive"
      })
      return
    }

    if (formData.title.trim().length > 200) {
      toast({
        title: "Error",
        description: "El título no puede exceder 200 caracteres",
        variant: "destructive"
      })
      return
    }

    if (formData.description.trim().length > 2000) {
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

    setLoading(true)
    try {
      // Validar fechas
      const startDate = new Date(formData.startDate)
      const endDate = formData.endDate ? new Date(formData.endDate) : startDate

      if (isNaN(startDate.getTime())) {
        throw new Error("La fecha de inicio no es válida")
      }
      if (isNaN(endDate.getTime())) {
        throw new Error("La fecha de fin no es válida")
      }
      if (endDate < startDate) {
        throw new Error("La fecha de fin debe ser después de la fecha de inicio")
      }

      // Preparar datos según el backend
      const eventData: any = {
        title: formData.title.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isPublic: formData.isPublic,
        isOnline: formData.isOnline,
        type: formData.type,
        category: formData.category
      }

      // Solo agregar campos opcionales si tienen valor
      if (formData.description.trim()) {
        eventData.description = formData.description.trim()
      }

      if (formData.location.trim()) {
        eventData.location = formData.location.trim()
      }

      if (formData.onlineUrl.trim()) {
        eventData.onlineUrl = formData.onlineUrl.trim()
      }

      if (formData.maxAttendees && parseInt(formData.maxAttendees) > 0) {
        eventData.maxAttendees = parseInt(formData.maxAttendees)
      }

      if (parseFloat(formData.price) > 0) {
        eventData.price = parseFloat(formData.price)
        eventData.currency = formData.currency
      }

      if (spaceId) {
        eventData.spaceId = spaceId
      }

      // Campos con valores por defecto
      eventData.tags = []
      eventData.tickets = []
      eventData.speakers = []
      eventData.streaming = {}

      console.log('Creating complete event with data:', eventData)
      const response = await createEvent(eventData)
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Evento creado exitosamente",
        })
        setOpen(false)
        setFormData({
          title: "",
          description: "",
          type: "online",
          category: "other",
          startDate: "",
          endDate: "",
          location: "",
          onlineUrl: "",
          isOnline: true,
          isPublic: true,
          maxAttendees: "",
          price: "0",
          currency: "USD"
        })
      } else {
        throw new Error(response.message || 'Error creando evento')
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: error.message || "Error creando evento",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título del Evento *</Label>
              <Input
                id="title"
                placeholder="Nombre del evento"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
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
                rows={3}
                maxLength={2000}
              />
              <p className="text-sm text-muted-foreground">
                {formData.description.length}/2000 caracteres
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Evento</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fechas y Ubicación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fechas y Ubicación</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
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
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Dirección o lugar del evento"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onlineUrl">URL Online</Label>
              <Input
                id="onlineUrl"
                placeholder="https://..."
                value={formData.onlineUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, onlineUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isOnline"
                checked={formData.isOnline}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOnline: checked }))}
              />
              <Label htmlFor="isOnline">Evento en línea</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="isPublic">Evento público</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Máximo de Asistentes</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  placeholder="Sin límite"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  min="1"
                  max="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    min="0"
                    step="0.01"
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
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
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
