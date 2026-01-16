"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useFacets } from "@/hooks/useFacets"
import { Plus, Palette, Camera, X, Loader2 } from "lucide-react"

interface CreateFacetModalProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const facetCategories = [
  { value: "artista", label: "Artista", icon: "🎨" },
  { value: "profesional", label: "Profesional", icon: "💼" },
  { value: "viajero", label: "Viajero", icon: "✈️" },
  { value: "gamer", label: "Gamer", icon: "🎮" },
  { value: "escritor", label: "Escritor", icon: "✍️" },
  { value: "otro", label: "Otro", icon: "🌟" },
]

export function CreateFacetModal({ onSuccess, trigger }: CreateFacetModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { createFacet, loading } = useFacets()
  
  const [facetData, setFacetData] = useState({
    name: "",
    description: "",
    category: "",
    avatar: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!facetData.name.trim() || !facetData.description.trim() || !facetData.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear faceta en el backend
      const result = await createFacet({
        name: facetData.name.trim(),
        description: facetData.description.trim(),
        category: facetData.category,
        avatar: facetData.avatar || undefined,
        isPublic: true,
      })

      if (result.success) {
        toast({
          title: "¡Faceta creada!",
          description: `La faceta "${facetData.name}" ha sido creada exitosamente.`,
        })

        // Reset form
        setFacetData({
          name: "",
          description: "",
          category: "",
          avatar: "",
        })
        
        setIsOpen(false)
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo crear la faceta.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la faceta. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 500KB para evitar problemas con base64)
      const maxSize = 500 * 1024 // 500KB en bytes
      if (file.size > maxSize) {
        toast({
          title: "Archivo muy grande",
          description: "El avatar no puede superar los 500KB. Por favor selecciona una imagen más pequeña.",
          variant: "destructive",
        })
        // Limpiar el input
        e.target.value = ''
        return
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato inválido",
          description: "Por favor selecciona una imagen (PNG, JPG, etc.).",
          variant: "destructive",
        })
        e.target.value = ''
        return
      }

      // In a real app, you would upload the file to a server
      const reader = new FileReader()
      reader.onload = (e) => {
        setFacetData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const selectedCategory = facetCategories.find(cat => cat.value === facetData.category)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear nueva Faceta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Crear Nueva Faceta
          </DialogTitle>
          <DialogDescription>
            Crea una nueva faceta para mostrar diferentes aspectos de tu personalidad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label>Avatar de la Faceta</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={facetData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {facetData.name.charAt(0).toUpperCase() || "F"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                >
                  <Camera className="h-4 w-4" />
                  Cambiar Avatar
                </Button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-muted-foreground">
                  PNG, JPG hasta 500KB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Faceta *</Label>
            <Input
              id="name"
              value={facetData.name}
              onChange={(e) => setFacetData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ej: Artista Digital, Viajero Aventurero..."
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground">
              {facetData.name.length}/30 caracteres
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={facetData.category}
              onValueChange={(value) => setFacetData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {facetCategories.map((category) => (
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={facetData.description}
              onChange={(e) => setFacetData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe qué representa esta faceta..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {facetData.description.length}/200 caracteres
            </p>
          </div>

          {/* Preview */}
          {facetData.name && facetData.category && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={facetData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {facetData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{facetData.name}</h3>
                    <p className="text-xs text-muted-foreground">{facetData.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedCategory && (
                        <Badge variant="outline" className="text-xs">
                          {selectedCategory.icon} {selectedCategory.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creando..." : "Crear Faceta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
