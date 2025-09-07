"use client"

import { useState } from "react"
import { useSpaces } from "@/hooks/useSpaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Users, Lock, Globe } from "lucide-react"
import { toast } from "sonner"

interface CreateSpaceModalProps {
  children?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}

const spaceCategories = [
  { value: "comunidad", label: "Comunidad", icon: "👥" },
  { value: "proyecto", label: "Proyecto", icon: "🚀" },
  { value: "club", label: "Club de Fans", icon: "❤️" },
  { value: "tienda", label: "Marketplace", icon: "🛒" },
  { value: "evento", label: "Evento", icon: "📅" },
  { value: "galeria", label: "Galería", icon: "🖼️" },
  { value: "musica", label: "Música", icon: "🎵" },
  { value: "tecnologia", label: "Tecnología", icon: "💻" }
]

export function CreateSpaceModal({ children, isOpen, onClose }: CreateSpaceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "comunidad",
    isPublic: true,
    tags: [] as string[],
    tagInput: ""
  })

  const { createSpace } = useSpaces()

  // Usar el estado externo si se proporciona, o el estado interno
  const modalOpen = isOpen !== undefined ? isOpen : open
  const setModalOpen = onClose ? onClose : setOpen

  const handleClose = () => {
    setModalOpen()
    setFormData({
      name: "",
      description: "",
      category: "comunidad",
      isPublic: true,
      tags: [],
      tagInput: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones del frontend
    if (!formData.name.trim()) {
      toast.error("El nombre del espacio es requerido")
      return
    }
    
    if (formData.name.length < 3) {
      toast.error("El nombre debe tener al menos 3 caracteres")
      return
    }
    
    if (formData.name.length > 100) {
      toast.error("El nombre no puede exceder 100 caracteres")
      return
    }
    
    if (formData.description.length > 1000) {
      toast.error("La descripción no puede exceder 1000 caracteres")
      return
    }
    
    if (formData.tags.length > 10) {
      toast.error("No puedes tener más de 10 tags")
      return
    }

    setLoading(true)
    
    try {
      const spaceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        isPublic: formData.isPublic,
        tags: formData.tags,
        settings: {
          modules: {
            chat: true,
            posts: true,
            events: formData.category === "evento",
            marketplace: formData.category === "tienda",
            tasks: formData.category === "proyecto",
            multimedia: formData.category === "galeria" || formData.category === "musica" || formData.category === "tecnologia"
          },
          privacy: formData.isPublic ? "public" : "private",
          moderation: "owner"
        }
      }
      
      console.log("Enviando datos del espacio:", spaceData)
      const result = await createSpace(spaceData)

      if (result.success) {
        toast.success(result.message || "Espacio creado exitosamente")
        handleClose()
      } else {
        toast.error(result.message || "Error creando el espacio")
      }
    } catch (error) {
      toast.error("Error de conexión")
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

  const selectedCategory = spaceCategories.find(cat => cat.value === formData.category)

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Espacio
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
                <Label htmlFor="name">Nombre del Espacio *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Comunidad de Arte Digital"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el propósito y objetivos de tu espacio..."
                  maxLength={1000}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaceCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isPublic">Espacio Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Los espacios públicos pueden ser encontrados y unirse libremente
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {formData.isPublic ? (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Espacio público - Visible para todos</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Espacio privado - Solo por invitación</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={formData.tagInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                  placeholder="Agregar etiqueta..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={!formData.tagInput.trim() || formData.tags.length >= 10}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Máximo 10 etiquetas. Presiona Enter para agregar.
              </p>
            </CardContent>
          </Card>

          {/* Vista Previa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">{selectedCategory?.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.name || "Nombre del espacio"}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCategory?.label}</p>
                  </div>
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
                <div className="flex items-center gap-2">
                  {formData.isPublic ? (
                    <Badge variant="outline" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Público
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Privado
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    0 miembros
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? "Creando..." : "Crear Espacio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}