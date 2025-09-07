"use client"

import { useState } from "react"
import { SpaceCard } from "@/components/spaces/space-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSpaces } from "@/hooks/useSpaces"
import { Search, TrendingUp, Users, Calendar, Plus } from "lucide-react"

const categories = ["Todos", "comunidad", "proyecto", "club", "tienda", "evento", "galeria", "musica", "tecnologia"]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const { spaces, loading, error, joinSpace, leaveSpace } = useSpaces()

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || space.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoinSpace = async (spaceId: string) => {
    const result = await joinSpace(spaceId)
    if (result.success) {
      console.log("Joined space successfully")
    } else {
      console.error("Error joining space:", result.message)
    }
  }

  const handleLeaveSpace = async (spaceId: string) => {
    const result = await leaveSpace(spaceId)
    if (result.success) {
      console.log("Left space successfully")
    } else {
      console.error("Error leaving space:", result.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Explorar Espacios</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubre comunidades increíbles donde puedes conectar con personas que comparten tus intereses
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar espacios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="popular" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="popular" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Users className="h-4 w-4" />
            Más activos
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            <Calendar className="h-4 w-4" />
            Nuevos
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="h-4 w-4" />
            Crear
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando espacios...</p>
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
          <>
            <TabsContent value="popular" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces
                  .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
                  .map((space) => (
                    <SpaceCard key={space.id} space={space} onJoin={handleJoinSpace} onLeave={handleLeaveSpace} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces
                  .sort((a, b) => (b.activeMembers || 0) - (a.activeMembers || 0))
                  .map((space) => (
                    <SpaceCard key={space.id} space={space} onJoin={handleJoinSpace} onLeave={handleLeaveSpace} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                  .map((space) => (
                    <SpaceCard key={space.id} space={space} onJoin={handleJoinSpace} onLeave={handleLeaveSpace} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Plus className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Crear tu propio espacio</h2>
                  <p className="text-muted-foreground">
                    ¿Tienes una pasión que quieres compartir? Crea tu propia comunidad y conecta con personas afines.
                  </p>
                </div>
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Crear espacio
                </Button>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {filteredSpaces.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron espacios que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
