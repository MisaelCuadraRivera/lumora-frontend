"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { Calendar, Plus } from "lucide-react"

interface SimpleCreateEventModalProps {
  children?: React.ReactNode
  spaceId?: string
}

export function SimpleCreateEventModal({ children, spaceId }: SimpleCreateEventModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isPublic: true
  })

  const { toast } = useToast()
  const { createEvent } = useEvents()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend (coinciden con el backend)
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
      if (!formData.startDate) {
        throw new Error("La fecha de inicio es requerida")
      }

      const startDate = new Date(formData.startDate)
      const endDate = formData.endDate ? new Date(formData.endDate) : startDate

      // Verificar que las fechas sean válidas
      if (isNaN(startDate.getTime())) {
        throw new Error("La fecha de inicio no es válida")
      }
      if (isNaN(endDate.getTime())) {
        throw new Error("La fecha de fin no es válida")
      }

      // Verificar que la fecha de fin sea después de la de inicio
      if (endDate < startDate) {
        throw new Error("La fecha de fin debe ser después de la fecha de inicio")
      }

      // Preparar datos según las validaciones del backend
      const eventData: any = {
        title: formData.title.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isPublic: formData.isPublic,
        isOnline: true
      }

      // Solo agregar campos opcionales si tienen valor
      if (formData.description.trim()) {
        eventData.description = formData.description.trim()
      }

      if (spaceId) {
        eventData.spaceId = spaceId
      }

      // Campos con valores por defecto según el modelo del backend
      eventData.type = "online"
      eventData.category = "other"
      eventData.location = ""
      eventData.tags = []
      eventData.tickets = []
      eventData.speakers = []
      eventData.streaming = {}

      console.log('Creating event with data:', eventData)
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
          startDate: "",
          endDate: "",
          isPublic: true
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Crear Nuevo Evento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
