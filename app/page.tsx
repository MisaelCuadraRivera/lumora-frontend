"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateSpaceModal } from "@/components/spaces/create-space-modal"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { 
  Plus, 
  Users, 
  Heart, 
  Briefcase, 
  ShoppingBag, 
  Music, 
  Camera, 
  Code,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"

export default function RootPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()

  const featuredSpaces = [
    {
      id: "1",
      name: "Comunidad de Desarrolladores",
      type: "community",
      description: "Espacio para compartir conocimiento y proyectos tech",
      memberCount: 1247,
      icon: Code,
      color: "bg-blue-500"
    },
    {
      id: "2",
      name: "Club de Fans de Música Indie",
      type: "fanclub",
      description: "Descubre y comparte la mejor música independiente",
      memberCount: 892,
      icon: Music,
      color: "bg-pink-500"
    },
    {
      id: "3",
      name: "Galería de Arte Digital",
      type: "gallery",
      description: "Exposición de arte digital y NFT",
      memberCount: 567,
      icon: Camera,
      color: "bg-indigo-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <AnimatedLogo />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Explora todas tus versiones
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crea espacios donde todo es posible. Lumora es la plataforma modular donde cada persona puede explorar todas sus versiones y crear espacios digitales totalmente personalizables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear mi primer espacio
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push("/explore")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explorar espacios
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Los tres pilares de Lumora
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Multiperfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cada usuario puede tener diferentes personalidades/facetas dentro de un mismo perfil. Control total de visibilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Espacios Vivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comunidades, diarios, tiendas, salones, clubs de fans, proyectos colaborativos. Más dinámicos que Discord.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Modularidad Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  El usuario decide qué funciones activar. Feed cruzado, publicaciones multiformato, herramientas Pro.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Featured Spaces */}
        <motion.div 
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Espacios destacados</h2>
            <Button variant="outline" onClick={() => router.push("/explore")}>
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSpaces.map((space) => (
              <Card 
                key={space.id} 
                className="cursor-pointer hover:shadow-lg transition-all border-border/50 bg-card/50 backdrop-blur-sm"
                onClick={() => router.push(`/spaces/${space.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${space.color} text-white`}>
                      <space.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{space.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{space.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {space.memberCount} miembros
                        </Badge>
                        <Badge variant="outline">
                          {space.type === 'community' ? 'Comunidad' : 
                           space.type === 'fanclub' ? 'Club de Fans' : 'Galería'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create Space Modal */}
      <CreateSpaceModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  )
}
