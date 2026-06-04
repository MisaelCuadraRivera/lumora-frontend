"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateSpaceModal } from "@/components/spaces/create-space-modal"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { useSpaces } from "@/hooks/useSpaces"
import { useAuth } from "@/lib/auth"
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
  Sparkles,
  BookOpen,
  Globe,
  Compass,
  Calendar
} from "lucide-react"
import { motion } from "framer-motion"
import { DebugPanel } from "@/components/debug-panel"

export default function RootPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { spaces, loading, error } = useSpaces({ autoFetch: !!user })

  // Debug logs
  console.log('RootPage - spaces:', spaces)
  console.log('RootPage - loading:', loading)
  console.log('RootPage - error:', error)

  // Mapeo de categorías a iconos y colores
  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { icon: any; color: string; label: string }> = {
      'comunidad': { icon: Users, color: 'bg-blue-500', label: 'Comunidad' },
      'proyecto': { icon: Briefcase, color: 'bg-green-500', label: 'Proyecto' },
      'club': { icon: Heart, color: 'bg-pink-500', label: 'Club de Fans' },
      'tienda': { icon: ShoppingBag, color: 'bg-purple-500', label: 'Marketplace' },
      'evento': { icon: Calendar, color: 'bg-orange-500', label: 'Evento' },
      'galeria': { icon: Camera, color: 'bg-indigo-500', label: 'Galería' },
      'musica': { icon: Music, color: 'bg-red-500', label: 'Música' },
      'tecnologia': { icon: Code, color: 'bg-cyan-500', label: 'Tecnología' },
      'Literatura': { icon: BookOpen, color: 'bg-amber-500', label: 'Literatura' },
      'Arte': { icon: Camera, color: 'bg-indigo-500', label: 'Arte' },
      'Viajes': { icon: Globe, color: 'bg-emerald-500', label: 'Viajes' },
      'Tecnología': { icon: Code, color: 'bg-cyan-500', label: 'Tecnología' },
      'Música': { icon: Music, color: 'bg-red-500', label: 'Música' }
    }
    
    return categoryMap[category] || { icon: Users, color: 'bg-gray-500', label: category }
  }

  // Espacios destacados (los primeros 6 espacios del backend)
  const featuredSpaces = spaces.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02]"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="flex justify-center mb-8">
              <AnimatedLogo className="h-16 w-16" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-primary">
                Bienvenido a Lumora
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Descubre comunidades únicas, conecta con personas afines y explora nuevos horizontes 
                en nuestra plataforma social multidimensional.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push('/explore')}
              >
                <Compass className="h-5 w-5 mr-2" />
                Explorar Espacios
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Espacio
                <Sparkles className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <DebugPanel />
      </div>

      {/* Featured Spaces Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Espacios Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Únete a comunidades vibrantes donde la creatividad y la colaboración cobran vida.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error cargando espacios</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSpaces.map((space) => {
                const categoryInfo = getCategoryInfo(space.category)
                const CategoryIcon = categoryInfo.icon
                
                return (
                  <Card 
                    key={space.id} 
                    className="cursor-pointer hover:shadow-lg transition-all border-border/50 bg-card/50 backdrop-blur-sm"
                    onClick={() => router.push(`/spaces/${space.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryInfo.color} text-white`}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{space.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {space.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {space.memberCount?.toLocaleString() || 0} miembros
                            </Badge>
                            <Badge variant="outline">
                              {categoryInfo.label}
                            </Badge>
                          </div>
                          {space.tags && space.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {space.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && spaces.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay espacios disponibles</h3>
              <p className="text-muted-foreground mb-4">Sé el primero en crear un espacio y comenzar una comunidad.</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Espacio
              </Button>
            </div>
          )}
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