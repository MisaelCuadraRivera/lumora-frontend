"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { mockPosts, mockSpaces } from "@/data"
import { 
  Clock, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Share2, 
  Users, 
  Hash,
  Filter,
  Settings,
  Sparkles,
  Zap,
  Star,
  Eye,
  Bookmark
} from "lucide-react"
import { PostCard } from "@/components/posts/post-card"
import { CreatePost } from "@/components/posts/create-post"
import { usePosts } from "@/hooks/usePosts"

const feedAlgorithms = [
  { id: "chronological", name: "Cronológico", icon: Clock, description: "Posts más recientes primero" },
  { id: "popular", name: "Popular", icon: TrendingUp, description: "Posts más populares" },
  { id: "relevant", name: "Relevante", icon: Sparkles, description: "Basado en tus intereses" },
  { id: "mixed", name: "Mixto", icon: Zap, description: "Combinación inteligente" }
]

const contentTypes = [
  { id: "all", name: "Todo", icon: Eye },
  { id: "posts", name: "Posts", icon: Hash },
  { id: "spaces", name: "Espacios", icon: Users },
  { id: "media", name: "Multimedia", icon: Bookmark }
]

export function CrossFeed() {
  const { user } = useAuth()
  const { posts: backendPosts, createPost, loading: postsLoading } = usePosts()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("mixed")
  const [selectedContentType, setSelectedContentType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    includeOwnFacets: true,
    includeSpaces: true,
    includeFriends: true,
    includeTrending: true,
    showMediaOnly: false,
    showUnreadOnly: false
  })
  const [posts, setPosts] = useState(mockPosts)

  // Función para manejar la creación de posts
  const handleCreatePost = async (content: string, facetId?: string, spaceId?: string, tags?: string[]) => {
    try {
      const postData = {
        content,
        facetId,
        spaceId,
        tags: tags || [],
        type: 'text'
      }
      
      const result = await createPost(postData)
      if (result.success) {
        // El hook usePosts ya actualiza automáticamente la lista de posts
        console.log('Post creado exitosamente')
      } else {
        console.error('Error creando post:', result.message)
      }
    } catch (error) {
      console.error('Error creando post:', error)
    }
  }

  // Simular feed cruzado
  const generateCrossFeed = () => {
    // En una implementación real, esto mezclaría contenido de:
    // - Diferentes facetas del usuario
    // - Espacios a los que pertenece
    // - Contenido de amigos
    // - Contenido trending
    // - Basado en el algoritmo seleccionado
    
    // Usar posts del backend si están disponibles, sino usar mockPosts
    let filteredPosts = [...(backendPosts.length > 0 ? backendPosts : mockPosts)]

    // Aplicar filtros
    if (filters.showMediaOnly) {
      filteredPosts = filteredPosts.filter(post => post.images && post.images.length > 0)
    }

    // Aplicar algoritmo
    switch (selectedAlgorithm) {
      case "chronological":
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "popular":
        filteredPosts.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
        break
      case "relevant":
        // Simular relevancia basada en facetas activas
        filteredPosts.sort((a, b) => {
          const activeFacet = user?.facets?.find(f => f.isActive)
          if (activeFacet && a.tags.includes(activeFacet.type)) return -1
          return 0
        })
        break
      case "mixed":
        // Combinación de relevancia y popularidad
        filteredPosts.sort((a, b) => {
          const relevanceScore = a.tags.includes(user?.facets?.find(f => f.isActive)?.type || "") ? 10 : 0
          const popularityScore = (b.likes + b.comments + b.shares) * 0.1
          const recencyScore = (new Date().getTime() - new Date(b.createdAt).getTime()) * 0.000001
          return (relevanceScore + popularityScore - recencyScore) - (relevanceScore + popularityScore - recencyScore)
        })
        break
    }

    setPosts(filteredPosts)
  }

  useEffect(() => {
    generateCrossFeed()
  }, [selectedAlgorithm, filters, selectedContentType, backendPosts])

  const handleFilterChange = (key: string, value: boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Feed Cruzado
          </h1>
          <p className="text-muted-foreground mt-1">
            Contenido de todas tus facetas y espacios
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {feedAlgorithms.map((algorithm) => (
                <SelectItem key={algorithm.id} value={algorithm.id}>
                  <div className="flex items-center gap-2">
                    <algorithm.icon className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{algorithm.name}</div>
                      <div className="text-xs text-muted-foreground">{algorithm.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Fuentes de contenido</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <Label htmlFor="include-own-facets">Mis facetas</Label>
                      </div>
                      <Switch
                        id="include-own-facets"
                        checked={filters.includeOwnFacets}
                        onCheckedChange={(checked) => handleFilterChange("includeOwnFacets", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <Label htmlFor="include-spaces">Espacios</Label>
                      </div>
                      <Switch
                        id="include-spaces"
                        checked={filters.includeSpaces}
                        onCheckedChange={(checked) => handleFilterChange("includeSpaces", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <Label htmlFor="include-friends">Amigos</Label>
                      </div>
                      <Switch
                        id="include-friends"
                        checked={filters.includeFriends}
                        onCheckedChange={(checked) => handleFilterChange("includeFriends", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <Label htmlFor="include-trending">Trending</Label>
                      </div>
                      <Switch
                        id="include-trending"
                        checked={filters.includeTrending}
                        onCheckedChange={(checked) => handleFilterChange("includeTrending", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Tipo de contenido</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        <Label htmlFor="show-media-only">Solo multimedia</Label>
                      </div>
                      <Switch
                        id="show-media-only"
                        checked={filters.showMediaOnly}
                        onCheckedChange={(checked) => handleFilterChange("showMediaOnly", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <Label htmlFor="show-unread-only">No leídos</Label>
                      </div>
                      <Switch
                        id="show-unread-only"
                        checked={filters.showUnreadOnly}
                        onCheckedChange={(checked) => handleFilterChange("showUnreadOnly", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Estadísticas</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Posts mostrados:</span>
                        <span className="font-medium">{posts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Facetas activas:</span>
                        <span className="font-medium">{user?.facets?.filter(f => f.isActive).length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Espacios:</span>
                        <span className="font-medium">{mockSpaces.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Type Tabs */}
      <Tabs value={selectedContentType} onValueChange={setSelectedContentType}>
        <TabsList className="grid w-full grid-cols-4">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="gap-2">
              <type.icon className="w-4 h-4" />
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedContentType} className="mt-6">
          {/* Feed Content */}
          <div className="space-y-4">
            {/* Componente para crear posts */}
            <CreatePost onPost={handleCreatePost} />
            
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && !postsLoading && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay contenido</h3>
                <p className="text-muted-foreground">
                  Ajusta los filtros o crea contenido para ver posts en tu feed
                </p>
              </div>
            )}

            {postsLoading && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Cargando posts...</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
