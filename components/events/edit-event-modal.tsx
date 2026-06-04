"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/hooks/useEvents"
import { Calendar as CalendarIcon, Image as ImageIcon, Upload, X, Loader2, MapPin, Edit3 } from "lucide-react"
import { uploadFileToS3, getMediaUrl } from "@/lib/mediaService"
import type { Event } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"

interface EditEventModalProps {
  event: Event
  onSuccess?: () => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
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

export function EditEventModal({ event, onSuccess, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: EditEventModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (val: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(val)
    } else {
      setInternalOpen(val)
    }
  }

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [dragActiveBanner, setDragActiveBanner] = useState(false)

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
  const { updateEvent } = useEvents({ autoFetch: false })

  useEffect(() => {
    if (event && open) {
      const formatForInput = (dateVal: any) => {
        if (!dateVal) return ""
        try {
          const d = new Date(dateVal)
          if (isNaN(d.getTime())) return ""
          const pad = (n: number) => n.toString().padStart(2, '0')
          const YYYY = d.getFullYear()
          const MM = pad(d.getMonth() + 1)
          const DD = pad(d.getDate())
          const HH = pad(d.getHours())
          const mm = pad(d.getMinutes())
          return `${YYYY}-${MM}-${DD}T${HH}:${mm}`
        } catch {
          return ""
        }
      }

      setFormData({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "online",
        category: event.category || "other",
        startDate: formatForInput(event.startDate),
        endDate: formatForInput(event.endDate),
        location: event.location?.address || "",
        onlineUrl: event.location?.virtualUrl || event.onlineUrl || "",
        isOnline: event.isOnline ?? (event.location?.type === "virtual"),
        isPublic: event.isPublic ?? true,
        maxAttendees: event.maxAttendees ? String(event.maxAttendees) : "",
        price: event.price !== undefined ? String(event.price) : "0",
        currency: event.currency || "USD"
      })

      setImagePreview(event.image ? getMediaUrl(event.image) : null)
      setBannerPreview(event.banner ? getMediaUrl(event.banner) : null)
      setImageFile(null)
      setBannerFile(null)
    }
  }, [event, open])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        toast({
          title: "Error de archivo",
          description: "Por favor, sube solo archivos de imagen (PNG, JPG, WEBP)",
          variant: "destructive"
        })
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleDragBanner = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveBanner(true)
    } else if (e.type === "dragleave") {
      setDragActiveBanner(false)
    }
  }

  const handleDropBanner = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveBanner(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setBannerFile(file)
        setBannerPreview(URL.createObjectURL(file))
      } else {
        toast({
          title: "Error de archivo",
          description: "Por favor, sube solo archivos de imagen (PNG, JPG, WEBP) para el banner",
          variant: "destructive"
        })
      }
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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

    if (!formData.startDate) {
      toast({
        title: "Error", 
        description: "La fecha de inicio es requerida",
        variant: "destructive"
      })
      return
    }

    if ((formData.type === "online" || formData.type === "hybrid") && !formData.onlineUrl.trim()) {
      toast({
        title: "Error",
        description: "La URL del evento online es requerida para eventos en línea o híbridos",
        variant: "destructive"
      })
      return
    }

    if ((formData.type === "offline" || formData.type === "hybrid") && !formData.location.trim()) {
      toast({
        title: "Error",
        description: "La ubicación física es requerida para eventos presenciales o híbridos",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      let imageKey = imagePreview ? event.image : null
      let bannerKey = bannerPreview ? event.banner : null
      
      const uploadPromises = []
      if (imageFile) {
        setUploading(true)
        uploadPromises.push(
          uploadFileToS3(imageFile)
            .then(key => { imageKey = key })
            .catch(err => { throw new Error(`Miniatura: ${err.message}`) })
        )
      }
      if (bannerFile) {
        setUploading(true)
        uploadPromises.push(
          uploadFileToS3(bannerFile)
            .then(key => { bannerKey = key })
            .catch(err => { throw new Error(`Banner: ${err.message}`) })
        )
      }
      
      if (uploadPromises.length > 0) {
        try {
          await Promise.all(uploadPromises)
        } catch (uploadErr: any) {
          throw new Error(`Error al subir archivos: ${uploadErr.message}`)
        } finally {
          setUploading(false)
        }
      }

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

      const isOnline = formData.type === "online" || formData.type === "hybrid"

      const eventData: any = {
        title: formData.title.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isPublic: formData.isPublic,
        isOnline: isOnline,
        type: formData.type,
        category: formData.category,
        imageKey: imageKey,
        bannerKey: bannerKey,
        image: imageKey,
        banner: bannerKey
      }

      if (formData.description.trim()) {
        eventData.description = formData.description.trim()
      } else {
        eventData.description = ""
      }

      eventData.location = {
        type: formData.type === "online" ? "virtual" : (formData.type === "hybrid" ? "hybrid" : "physical"),
        address: formData.type === "online" ? "" : formData.location.trim(),
        city: event.location?.city || "",
        country: event.location?.country || "",
        virtualUrl: formData.type === "offline" ? "" : formData.onlineUrl.trim()
      }

      if (formData.type !== "offline" && formData.onlineUrl.trim()) {
        eventData.onlineUrl = formData.onlineUrl.trim()
      } else {
        eventData.onlineUrl = ""
      }

      if (formData.maxAttendees && parseInt(formData.maxAttendees) > 0) {
        eventData.maxAttendees = parseInt(formData.maxAttendees)
      } else {
        eventData.maxAttendees = null
      }

      const parsedPrice = parseFloat(formData.price)
      eventData.price = isNaN(parsedPrice) ? 0 : parsedPrice
      eventData.currency = formData.currency

      console.log('Updating event with data:', eventData)
      const response = await updateEvent(event.id, eventData)
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Evento actualizado exitosamente",
        })
        setOpen(false)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error(response.message || 'Error actualizando evento')
      }
    } catch (error: any) {
      console.error('Error updating event:', error)
      toast({
        title: "Error",
        description: error.message || "Error al actualizar evento",
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
      <DialogContent className="sm:max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-thin border-border/40 bg-background/95 backdrop-blur-md shadow-2xl rounded-2xl p-6 md:p-8 transition-all duration-300">
        <DialogHeader className="pb-2 border-b border-border/20">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Edit3 className="h-6 w-6 text-primary" />
            Editar Evento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Columna 1: Multimedia e Identidad Visual */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/30 backdrop-blur-sm shadow-sm hover:border-border/50 hover:bg-muted/15 transition-all duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Multimedia</h3>
              </div>

              {/* Imagen de Portada */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Imagen de Portada (Miniatura 1:1)</Label>
                <div 
                  onClick={() => document.getElementById('edit-cover-image-input')?.click()}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative h-44 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                    imagePreview 
                      ? 'border-transparent bg-muted shadow-inner' 
                      : dragActive
                        ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner ring-2 ring-primary/20'
                        : 'border-muted-foreground/30 hover:border-primary/50 bg-card/40 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  {imagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imagePreview} 
                        alt="Vista previa de portada" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-7 w-7 shadow-md hover:scale-110 active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveImage()
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-4 text-center text-muted-foreground group">
                      <div className={`p-2.5 rounded-full bg-primary/10 text-primary transition-transform duration-300 ${dragActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">
                          {dragActive ? '¡Suelta aquí!' : 'Sube miniatura (1:1)'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          PNG, JPG o WEBP (máx. 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="edit-cover-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Banner del Evento */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Banner del Evento (Horizontal 16:9)</Label>
                <div 
                  onClick={() => document.getElementById('edit-banner-image-input')?.click()}
                  onDragEnter={handleDragBanner}
                  onDragOver={handleDragBanner}
                  onDragLeave={handleDragBanner}
                  onDrop={handleDropBanner}
                  className={`relative h-44 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                    bannerPreview 
                      ? 'border-transparent bg-muted shadow-inner' 
                      : dragActiveBanner
                        ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner ring-2 ring-primary/20'
                        : 'border-muted-foreground/30 hover:border-primary/50 bg-card/40 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  {bannerPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={bannerPreview} 
                        alt="Vista previa del banner" 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-7 w-7 shadow-md hover:scale-110 active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveBanner()
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-4 text-center text-muted-foreground group">
                      <div className={`p-2.5 rounded-full bg-primary/10 text-primary transition-transform duration-300 ${dragActiveBanner ? 'scale-125' : 'group-hover:scale-110'}`}>
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">
                          {dragActiveBanner ? '¡Suelta aquí!' : 'Sube banner (16:9)'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Recomendado horizontal
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="edit-banner-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                </div>
              </div>
            </div>

            {/* Columna 2: Información del Evento */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/30 backdrop-blur-sm shadow-sm hover:border-border/50 hover:bg-muted/15 transition-all duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Información Básica</h3>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs font-medium text-muted-foreground">Título del Evento *</Label>
                <Input
                  id="edit-title"
                  placeholder="Nombre del evento"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  maxLength={200}
                  className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {formData.title.length}/200 caracteres
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-xs font-medium text-muted-foreground">Descripción</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe tu evento..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  maxLength={2000}
                  className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 resize-none h-[120px]"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {formData.description.length}/2000 caracteres
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-type" className="text-xs font-medium text-muted-foreground">Tipo de Evento</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 transition-all duration-200 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-xs">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-category" className="text-xs font-medium text-muted-foreground">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 transition-all duration-200 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="text-xs">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Columna 3: Fechas, Lugar e Inscripción */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/30 backdrop-blur-sm shadow-sm hover:border-border/50 hover:bg-muted/15 transition-all duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-border/20">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Fechas y Lugar</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-startDate" className="text-xs font-medium text-muted-foreground">Fecha Inicio *</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="edit-startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                      className="flex-1 bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs px-2 h-9"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-background/60 hover:bg-background/90 border-muted-foreground/20 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all shrink-0"
                          title="Abrir selector de fecha y hora"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3 bg-background/95 backdrop-blur-md border-border/40 shadow-xl rounded-xl space-y-3" align="end">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ? new Date(formData.startDate) : undefined}
                          onSelect={(date) => {
                            if (!date) return
                            let hours = "12"
                            let minutes = "00"
                            if (formData.startDate) {
                              const timePart = formData.startDate.split('T')[1]
                              if (timePart) {
                                const [h, m] = timePart.split(':')
                                hours = h || "12"
                                minutes = m || "00"
                              }
                            }
                            const pad = (n: number) => n.toString().padStart(2, '0')
                            const YYYY = date.getFullYear()
                            const MM = pad(date.getMonth() + 1)
                            const DD = pad(date.getDate())
                            setFormData(prev => ({
                              ...prev,
                              startDate: `${YYYY}-${MM}-${DD}T${hours}:${minutes}`
                            }))
                          }}
                          locale={es}
                        />
                        <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                          <span className="text-xs font-medium text-muted-foreground">Hora:</span>
                          <Input
                            type="time"
                            value={formData.startDate ? formData.startDate.split('T')[1] || "12:00" : "12:00"}
                            onChange={(e) => {
                              const timeVal = e.target.value || "12:00"
                              const datePart = formData.startDate ? formData.startDate.split('T')[0] : (() => {
                                const pad = (n: number) => n.toString().padStart(2, '0')
                                const today = new Date()
                                return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
                              })()
                              setFormData(prev => ({
                                ...prev,
                                startDate: `${datePart}T${timeVal}`
                              }))
                            }}
                            className="w-28 h-8 text-xs bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-endDate" className="text-xs font-medium text-muted-foreground">Fecha Fin</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="edit-endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="flex-1 bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs px-2 h-9"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-background/60 hover:bg-background/90 border-muted-foreground/20 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all shrink-0"
                          title="Abrir selector de fecha y hora"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3 bg-background/95 backdrop-blur-md border-border/40 shadow-xl rounded-xl space-y-3" align="end">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ? new Date(formData.endDate) : undefined}
                          onSelect={(date) => {
                            if (!date) return
                            let hours = "12"
                            let minutes = "00"
                            if (formData.endDate) {
                              const timePart = formData.endDate.split('T')[1]
                              if (timePart) {
                                const [h, m] = timePart.split(':')
                                hours = h || "12"
                                minutes = m || "00"
                              }
                            }
                            const pad = (n: number) => n.toString().padStart(2, '0')
                            const YYYY = date.getFullYear()
                            const MM = pad(date.getMonth() + 1)
                            const DD = pad(date.getDate())
                            setFormData(prev => ({
                              ...prev,
                              endDate: `${YYYY}-${MM}-${DD}T${hours}:${minutes}`
                            }))
                          }}
                          locale={es}
                        />
                        <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                          <span className="text-xs font-medium text-muted-foreground">Hora:</span>
                          <Input
                            type="time"
                            value={formData.endDate ? formData.endDate.split('T')[1] || "12:00" : "12:00"}
                            onChange={(e) => {
                              const timeVal = e.target.value || "12:00"
                              const datePart = formData.endDate ? formData.endDate.split('T')[0] : (() => {
                                const pad = (n: number) => n.toString().padStart(2, '0')
                                const today = new Date()
                                return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
                              })()
                              setFormData(prev => ({
                                ...prev,
                                endDate: `${datePart}T${timeVal}`
                              }))
                            }}
                            className="w-28 h-8 text-xs bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="space-y-3 transition-all duration-300">
                {(formData.type === "offline" || formData.type === "hybrid") && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Label htmlFor="edit-location" className="text-xs font-medium text-muted-foreground">Ubicación Física *</Label>
                    <Input
                      id="edit-location"
                      placeholder="Dirección o lugar físico"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      maxLength={500}
                      className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs h-9"
                    />
                  </div>
                )}

                {(formData.type === "online" || formData.type === "hybrid") && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Label htmlFor="edit-onlineUrl" className="text-xs font-medium text-muted-foreground">URL del Evento Online *</Label>
                    <Input
                      id="edit-onlineUrl"
                      placeholder="https://meet.google.com/..."
                      value={formData.onlineUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, onlineUrl: e.target.value }))}
                      className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs h-9"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border/20 pt-2 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/40 border border-border/30">
                  <Label htmlFor="edit-isPublic" className="text-xs font-semibold cursor-pointer">¿Es público?</Label>
                  <Switch
                    id="edit-isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-maxAttendees" className="text-xs font-medium text-muted-foreground">Máx. Asistentes</Label>
                    <Input
                      id="edit-maxAttendees"
                      type="number"
                      placeholder="Sin límite"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                      min="1"
                      max="10000"
                      className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs px-2 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-price" className="text-xs font-medium text-muted-foreground">Precio</Label>
                    <div className="flex gap-1">
                      <Input
                        id="edit-price"
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        min="0"
                        step="0.01"
                        className="bg-background/60 hover:bg-background/90 focus:bg-background border-muted-foreground/20 hover:border-primary/40 focus:border-primary transition-all duration-200 text-xs px-2 h-9"
                      />
                      <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger className="w-16 bg-background/60 hover:bg-background/90 border-muted-foreground/20 hover:border-primary/40 transition-all duration-200 text-xs px-1.5 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD" className="text-xs">USD</SelectItem>
                          <SelectItem value="MXN" className="text-xs">MXN</SelectItem>
                          <SelectItem value="EUR" className="text-xs">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="px-4 py-2 hover:bg-accent/10 transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md px-5 py-2 font-medium"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo imágenes...
                </>
              ) : loading ? (
                "Guardando..."
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
