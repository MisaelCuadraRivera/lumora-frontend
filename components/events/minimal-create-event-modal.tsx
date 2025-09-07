"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { Calendar, Plus } from "lucide-react"

interface MinimalCreateEventModalProps {
  children?: React.ReactNode
  spaceId?: string
}

export function MinimalCreateEventModal({ children, spaceId }: MinimalCreateEventModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")

  const { toast } = useToast()
  const { createEvent } = useEvents()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es requerido",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Datos mínimos según el backend
      const eventData = {
        title: title.trim(),
        startDate: new Date().toISOString(), // Fecha actual
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora después
        isPublic: true,
        isOnline: true,
        type: "online",
        category: "other"
      }

      console.log('Creating minimal event with data:', eventData)
      const response = await createEvent(eventData)
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Evento creado exitosamente",
        })
        setOpen(false)
        setTitle("")
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Crear Evento (Mínimo)
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento *</Label>
            <Input
              id="title"
              placeholder="Nombre del evento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
            <p className="text-sm text-muted-foreground">
              {title.length}/200 caracteres
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• Fecha de inicio: Ahora</p>
            <p>• Fecha de fin: En 1 hora</p>
            <p>• Tipo: En línea</p>
            <p>• Público: Sí</p>
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
