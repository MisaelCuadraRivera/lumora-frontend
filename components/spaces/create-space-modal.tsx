"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  X, 
  Plus, 
  Users, 
  BookOpen, 
  Heart, 
  Briefcase, 
  ShoppingBag, 
  Music, 
  Camera, 
  Code,
  Globe,
  Lock,
  Eye,
  Settings,
  Palette,
  Hash,
  MessageSquare,
  Calendar,
  FileText,
  Image,
  Video,
  Music2,
  ShoppingCart,
  CheckCircle,
  Star
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateSpaceModalProps {
  isOpen: boolean
  onClose: () => void
}

const spaceTypes = [
  {
    id: "community",
    name: "Comunidad",
    description: "Espacio para grupos con intereses comunes",
    icon: Users,
    color: "bg-blue-500",
    features: ["Chat grupal", "Posts", "Eventos", "Multimedia"]
  },
  {
    id: "diary",
    name: "Diario Personal",
    description: "Tu espacio privado para reflexiones y contenido personal",
    icon: BookOpen,
    color: "bg-purple-500",
    features: ["Posts privados", "Multimedia", "Notas", "Moodboard"]
  },
  {
    id: "fanclub",
    name: "Club de Fans",
    description: "Comunidad dedicada a artistas, creadores o marcas",
    icon: Heart,
    color: "bg-pink-500",
    features: ["Fan art", "Discusiones", "Eventos", "Exclusivos"]
  },
  {
    id: "project",
    name: "Proyecto",
    description: "Espacio para colaborar en proyectos creativos o profesionales",
    icon: Briefcase,
    color: "bg-green-500",
    features: ["Tareas", "Documentos", "Chat", "Timeline"]
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Tienda digital para vender productos o servicios",
    icon: ShoppingBag,
    color: "bg-orange-500",
    features: ["Catálogo", "Pagos", "Reviews", "Chat"]
  },
  {
    id: "gallery",
    name: "Galería",
    description: "Espacio para mostrar arte, fotografía o contenido visual",
    icon: Camera,
    color: "bg-indigo-500",
    features: ["Galería", "Portfolio", "Comentarios", "Ventas"]
  },
  {
    id: "music",
    name: "Música",
    description: "Espacio para compartir y descubrir música",
    icon: Music,
    color: "bg-red-500",
    features: ["Playlists", "Streaming", "Colaboraciones", "Eventos"]
  },
  {
    id: "tech",
    name: "Tecnología",
    description: "Comunidad para desarrolladores y entusiastas tech",
    icon: Code,
    color: "bg-gray-500",
    features: ["Code sharing", "Tutoriales", "Discusiones", "Proyectos"]
  }
]

const modules = [
  { id: "chat", name: "Chat", icon: MessageSquare, description: "Chat grupal y privado" },
  { id: "posts", name: "Posts", icon: FileText, description: "Publicaciones y contenido" },
  { id: "events", name: "Eventos", icon: Calendar, description: "Eventos y meetups" },
  { id: "multimedia", name: "Multimedia", icon: Image, description: "Galerías y contenido visual" },
  { id: "music", name: "Música", icon: Music2, description: "Playlists y streaming" },
  { id: "marketplace", name: "Marketplace", icon: ShoppingCart, description: "Ventas y productos" },
  { id: "tasks", name: "Tareas", icon: CheckCircle, description: "Gestión de proyectos" },
  { id: "reviews", name: "Reviews", icon: Star, description: "Sistema de valoraciones" }
]

export function CreateSpaceModal({ isOpen, onClose }: CreateSpaceModalProps) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [spaceData, setSpaceData] = useState({
    name: "",
    description: "",
    privacy: "public",
    selectedModules: [] as string[],
    theme: "default",
    allowInvites: true,
    requireApproval: false
  })
  const { toast } = useToast()

  const handleModuleToggle = (moduleId: string) => {
    setSpaceData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(moduleId)
        ? prev.selectedModules.filter(id => id !== moduleId)
        : [...prev.selectedModules, moduleId]
    }))
  }

  const handleNext = () => {
    if (step === 1 && !selectedType) {
      toast({
        title: "Selecciona un tipo de espacio",
        description: "Elige el tipo de espacio que quieres crear",
        variant: "destructive"
      })
      return
    }
    if (step === 2 && !spaceData.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "El nombre del espacio es obligatorio",
        variant: "destructive"
      })
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCreate = async () => {
    try {
      // Aquí iría la lógica para crear el espacio
      toast({
        title: "¡Espacio creado!",
        description: `"${spaceData.name}" ha sido creado exitosamente`,
      })
      onClose()
      setStep(1)
      setSelectedType("")
      setSpaceData({
        name: "",
        description: "",
        privacy: "public",
        selectedModules: [],
        theme: "default",
        allowInvites: true,
        requireApproval: false
      })
    } catch (error) {
      toast({
        title: "Error al crear espacio",
        description: "Hubo un problema al crear el espacio",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Crear Nuevo Espacio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Space Type */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Qué tipo de espacio quieres crear?</h3>
                <p className="text-muted-foreground">Elige el tipo que mejor se adapte a tus necesidades</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spaceTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedType === type.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color} text-white`}>
                          <type.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{type.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {type.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Información básica</h3>
                <p className="text-muted-foreground">Configura los detalles fundamentales de tu espacio</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="space-name">Nombre del espacio</Label>
                  <Input
                    id="space-name"
                    placeholder="Ej: Comunidad de Desarrolladores"
                    value={spaceData.name}
                    onChange={(e) => setSpaceData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="space-description">Descripción</Label>
                  <Textarea
                    id="space-description"
                    placeholder="Describe qué es tu espacio y qué ofrece..."
                    value={spaceData.description}
                    onChange={(e) => setSpaceData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="privacy">Privacidad</Label>
                    <Select
                      value={spaceData.privacy}
                      onValueChange={(value) => setSpaceData(prev => ({ ...prev, privacy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Público
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Privado
                          </div>
                        </SelectItem>
                        <SelectItem value="friends">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Solo amigos
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Tema visual</Label>
                    <Select
                      value={spaceData.theme}
                      onValueChange={(value) => setSpaceData(prev => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Tema por defecto</SelectItem>
                        <SelectItem value="dark">Modo oscuro</SelectItem>
                        <SelectItem value="minimal">Minimalista</SelectItem>
                        <SelectItem value="colorful">Colorido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <Label htmlFor="allow-invites">Permitir invitaciones</Label>
                    </div>
                    <Switch
                      id="allow-invites"
                      checked={spaceData.allowInvites}
                      onCheckedChange={(checked) => setSpaceData(prev => ({ ...prev, allowInvites: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <Label htmlFor="require-approval">Aprobación manual</Label>
                    </div>
                    <Switch
                      id="require-approval"
                      checked={spaceData.requireApproval}
                      onCheckedChange={(checked) => setSpaceData(prev => ({ ...prev, requireApproval: checked }))}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Modules Selection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Módulos y funcionalidades</h3>
                <p className="text-muted-foreground">Personaliza tu espacio seleccionando las herramientas que necesitas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <Card
                    key={module.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      spaceData.selectedModules.includes(module.id) ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          spaceData.selectedModules.includes(module.id) ? "bg-primary" : "bg-muted"
                        }`}>
                          <module.icon className={`w-5 h-5 ${
                            spaceData.selectedModules.includes(module.id) ? "text-primary-foreground" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        {spaceData.selectedModules.includes(module.id) && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumen del espacio</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {spaceData.name}</p>
                  <p><strong>Tipo:</strong> {spaceTypes.find(t => t.id === selectedType)?.name}</p>
                  <p><strong>Privacidad:</strong> {spaceData.privacy === 'public' ? 'Público' : spaceData.privacy === 'private' ? 'Privado' : 'Solo amigos'}</p>
                  <p><strong>Módulos seleccionados:</strong> {spaceData.selectedModules.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : handleBack}
              disabled={step === 1}
            >
              {step === 1 ? "Cancelar" : "Atrás"}
            </Button>

            <Button
              onClick={step === 3 ? handleCreate : handleNext}
              className="min-w-[100px]"
            >
              {step === 3 ? "Crear Espacio" : "Siguiente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
