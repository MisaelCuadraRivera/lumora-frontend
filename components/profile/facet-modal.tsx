"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users, 
  Lock, 
  Globe,
  Palette,
  Settings,
  CheckCircle,
  X,
  User,
  Briefcase,
  Heart,
  Camera,
  Music,
  Code,
  BookOpen,
  MessageSquare,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { useFacets } from "@/hooks/useFacets"

interface FacetModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  facet?: any
  onSuccess?: () => void
}

const facetTypes = [
  { id: "artista", name: "Artista", icon: Palette, color: "bg-purple-500", description: "Artista, creador y creativo" },
  { id: "profesional", name: "Profesional", icon: Briefcase, color: "bg-blue-500", description: "Trabajo, desarrollo o profesión" },
  { id: "viajero", name: "Viajero", icon: Globe, color: "bg-green-500", description: "Viajes, exploración y aventuras" },
  { id: "gamer", name: "Gamer", icon: CheckCircle, color: "bg-red-500", description: "Videojuegos y gaming" },
  { id: "escritor", name: "Escritor", icon: BookOpen, color: "bg-indigo-500", description: "Escritura, lectura y literatura" },
  { id: "otro", name: "Otro", icon: Settings, color: "bg-gray-500", description: "Otros aspectos de tu vida y personalidad" }
]

const privacyLevels = [
  { id: "public", name: "Público", icon: Globe, description: "Visible para todos" },
  { id: "friends", name: "Solo amigos", icon: Users, description: "Visible solo para amigos" },
  { id: "private", name: "Privado", icon: Lock, description: "Solo tú puedes ver" },
  { id: "custom", name: "Personalizado", icon: Settings, description: "Configuración específica" }
]

export function FacetModal({ isOpen, onClose, mode, facet, onSuccess }: FacetModalProps) {
  const [facetData, setFacetData] = useState({
    name: facet?.name || "",
    type: facet?.type || facet?.category || "",
    description: facet?.description || "",
    privacy: facet?.privacy || "public",
    avatar: facet?.avatar || "",
    bio: facet?.bio || "",
    isActive: facet?.isActive || false,
    customPrivacy: facet?.customPrivacy || {
      allowComments: true,
      allowMessages: true,
      allowFollows: true,
      showInSearch: true
    }
  })
  
  const { toast } = useToast()
  const { user } = useAuth()
  const { createFacet, updateFacet, loading } = useFacets({ autoFetch: false })

  // Synchronize state when facet or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setFacetData({
        name: facet?.name || "",
        type: facet?.type || facet?.category || "",
        description: facet?.description || "",
        privacy: facet?.privacy || "public",
        avatar: facet?.avatar || "",
        bio: facet?.bio || "",
        isActive: facet?.isActive || false,
        customPrivacy: facet?.customPrivacy || {
          allowComments: true,
          allowMessages: true,
          allowFollows: true,
          showInSearch: true
        }
      })
    }
  }, [facet, isOpen])

  const handleSave = async () => {
    if (!facetData.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "El nombre de la faceta es obligatorio",
        variant: "destructive"
      })
      return
    }

    if (!facetData.type) {
      toast({
        title: "Tipo requerido",
        description: "Selecciona un tipo de faceta",
        variant: "destructive"
      })
      return
    }

    try {
      // Map any English/legacy categories to backend-supported Spanish categories
      const categoryMap: { [key: string]: string } = {
        personal: "otro",
        professional: "profesional",
        profesional: "profesional",
        creative: "artista",
        artista: "artista",
        social: "otro",
        fan: "otro",
        photographer: "artista",
        musician: "artista",
        developer: "profesional",
        writer: "escritor",
        escritor: "escritor",
        traveler: "viajero",
        viajero: "viajero",
        gamer: "gamer",
        otro: "otro",
        other: "otro"
      }

      const backendCategory = categoryMap[facetData.type] || "otro"

      const payload = {
        name: facetData.name.trim(),
        description: facetData.description.trim(),
        category: backendCategory, // map frontend selected "type" to backend expected valid "category"
        avatar: facetData.avatar || undefined,
        bio: facetData.bio || undefined,
        isPublic: facetData.privacy === "public",
      }

      let result
      if (mode === "create") {
        result = await createFacet(payload)
      } else {
        result = await updateFacet(facet.id, payload)
      }

      if (result.success) {
        toast({
          title: mode === "create" ? "¡Faceta creada!" : "¡Faceta actualizada!",
          description: `"${facetData.name}" ha sido ${mode === "create" ? "creada" : "actualizada"} exitosamente`,
        })
        onSuccess?.()
        onClose()
      } else {
        throw new Error(result.message || "Error al procesar la solicitud")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Hubo un problema al ${mode === "create" ? "crear" : "actualizar"} la faceta`,
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {mode === "create" ? "Crear Nueva Faceta" : "Editar Faceta"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="facet-name">Nombre de la faceta</Label>
              <Input
                id="facet-name"
                placeholder="Ej: Mi yo creativo"
                value={facetData.name}
                onChange={(e) => setFacetData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="facet-type">Tipo de faceta</Label>
              <Select
                value={facetData.type}
                onValueChange={(value) => setFacetData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {facetTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${type.color}`} />
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="facet-description">Descripción</Label>
              <Textarea
                id="facet-description"
                placeholder="Describe esta faceta de tu personalidad..."
                value={facetData.description}
                onChange={(e) => setFacetData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="facet-bio">Biografía</Label>
              <Textarea
                id="facet-bio"
                placeholder="Una breve biografía para esta faceta..."
                value={facetData.bio}
                onChange={(e) => setFacetData(prev => ({ ...prev, bio: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración de privacidad</h3>
            
            <div>
              <Label htmlFor="privacy-level">Nivel de privacidad</Label>
              <Select
                value={facetData.privacy}
                onValueChange={(value) => setFacetData(prev => ({ ...prev, privacy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      <div className="flex items-center gap-2">
                        <level.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{level.name}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {facetData.privacy === "custom" && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Configuración personalizada</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <Label htmlFor="show-in-search">Aparecer en búsquedas</Label>
                  </div>
                  <Switch
                    id="show-in-search"
                    checked={facetData.customPrivacy.showInSearch}
                    onCheckedChange={(checked) => setFacetData(prev => ({
                      ...prev,
                      customPrivacy: { ...prev.customPrivacy, showInSearch: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <Label htmlFor="allow-follows">Permitir que me sigan</Label>
                  </div>
                  <Switch
                    id="allow-follows"
                    checked={facetData.customPrivacy.allowFollows}
                    onCheckedChange={(checked) => setFacetData(prev => ({
                      ...prev,
                      customPrivacy: { ...prev.customPrivacy, allowFollows: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <Label htmlFor="allow-messages">Permitir mensajes</Label>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={facetData.customPrivacy.allowMessages}
                    onCheckedChange={(checked) => setFacetData(prev => ({
                      ...prev,
                      customPrivacy: { ...prev.customPrivacy, allowMessages: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <Label htmlFor="allow-comments">Permitir comentarios</Label>
                  </div>
                  <Switch
                    id="allow-comments"
                    checked={facetData.customPrivacy.allowComments}
                    onCheckedChange={(checked) => setFacetData(prev => ({
                      ...prev,
                      customPrivacy: { ...prev.customPrivacy, allowComments: checked }
                    }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Facet Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vista previa</h3>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={facetData.avatar || user?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {facetData.name.charAt(0).toUpperCase() || "F"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{facetData.name || "Nombre de la faceta"}</h4>
                      {facetData.type && (
                        <Badge variant="secondary">
                          {facetTypes.find(t => t.id === facetData.type)?.name}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {privacyLevels.find(p => p.id === facetData.privacy)?.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {facetData.description || "Descripción de la faceta"}
                    </p>
                    {facetData.bio && (
                      <p className="text-sm">{facetData.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>

            <Button onClick={handleSave} className="min-w-[100px]" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />}
              {loading ? "Guardando..." : (mode === "create" ? "Crear Faceta" : "Guardar Cambios")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
