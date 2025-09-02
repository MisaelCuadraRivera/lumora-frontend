"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FacetModal } from "./facet-modal"
import { useAuth } from "@/lib/auth"
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
  User,
  Briefcase,
  Heart,
  Camera,
  Music,
  Code,
  BookOpen,
  Sparkles
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const facetTypes = [
  { id: "personal", name: "Personal", icon: User, color: "bg-blue-500" },
  { id: "professional", name: "Profesional", icon: Briefcase, color: "bg-green-500" },
  { id: "creative", name: "Creativo", icon: Palette, color: "bg-purple-500" },
  { id: "social", name: "Social", icon: Users, color: "bg-pink-500" },
  { id: "fan", name: "Fan", icon: Heart, color: "bg-red-500" },
  { id: "photographer", name: "Fotógrafo", icon: Camera, color: "bg-indigo-500" },
  { id: "musician", name: "Músico", icon: Music, color: "bg-orange-500" },
  { id: "developer", name: "Desarrollador", icon: Code, color: "bg-gray-500" },
  { id: "writer", name: "Escritor", icon: BookOpen, color: "bg-teal-500" }
]

const privacyIcons = {
  public: Globe,
  friends: Users,
  private: Lock,
  custom: Settings
}

export function FacetManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFacet, setEditingFacet] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const handleEditFacet = (facet: any) => {
    setEditingFacet(facet)
  }

  const handleDeleteFacet = (facetId: string) => {
    // Aquí iría la lógica para eliminar la faceta
    toast({
      title: "Faceta eliminada",
      description: "La faceta ha sido eliminada exitosamente",
    })
  }

  const handleActivateFacet = (facetId: string) => {
    // Aquí iría la lógica para activar la faceta
    toast({
      title: "Faceta activada",
      description: "Has cambiado a esta faceta",
    })
  }

  const filteredFacets = user?.facets?.filter(facet => {
    if (activeTab === "all") return true
    if (activeTab === "active") return facet.isActive
    if (activeTab === "public") return facet.privacy === "public"
    if (activeTab === "private") return facet.privacy === "private"
    return true
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mis Facetas
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona las diferentes versiones de tu personalidad
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Faceta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.facets?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total de facetas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user?.facets?.filter(f => f.isActive).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Faceta activa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user?.facets?.filter(f => f.privacy === "public").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Públicas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user?.facets?.filter(f => f.privacy === "private").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Privadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facets List */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Gestionar Facetas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Activa</TabsTrigger>
              <TabsTrigger value="public">Públicas</TabsTrigger>
              <TabsTrigger value="private">Privadas</TabsTrigger>
              <TabsTrigger value="custom">Personalizadas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredFacets.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay facetas</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" 
                      ? "Crea tu primera faceta para explorar diferentes versiones de ti mismo"
                      : `No tienes facetas ${activeTab === "active" ? "activas" : activeTab}`
                    }
                  </p>
                  {activeTab === "all" && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear mi primera faceta
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFacets.map((facet) => {
                    const facetType = facetTypes.find(t => t.id === facet.type)
                    const PrivacyIcon = privacyIcons[facet.privacy as keyof typeof privacyIcons] || Globe

                    return (
                      <motion.div
                        key={facet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className={`border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg ${
                          facet.isActive ? "ring-2 ring-primary" : ""
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={facet.avatar || user?.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {facet.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold truncate">{facet.name}</h4>
                                  {facet.isActive && (
                                    <Badge variant="default" className="text-xs">
                                      Activa
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 truncate">
                                  {facet.description || "Sin descripción"}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                  {facetType && (
                                    <Badge variant="secondary" className="text-xs">
                                      <div className={`w-2 h-2 rounded-full ${facetType.color} mr-1`} />
                                      {facetType.name}
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    <PrivacyIcon className="w-3 h-3 mr-1" />
                                    {facet.privacy === "public" ? "Público" : 
                                     facet.privacy === "private" ? "Privado" : 
                                     facet.privacy === "friends" ? "Amigos" : "Personalizado"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!facet.isActive && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleActivateFacet(facet.id)}
                                      className="flex-1"
                                    >
                                      Activar
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditFacet(facet)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteFacet(facet.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <FacetModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />
      
      <FacetModal 
        isOpen={!!editingFacet} 
        onClose={() => setEditingFacet(null)}
        mode="edit"
        facet={editingFacet}
      />
    </div>
  )
}
