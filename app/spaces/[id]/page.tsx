"use client"

import { useParams } from "next/navigation"
import { SpaceHeader } from "@/components/spaces/space-header"
import { SpacePoll } from "@/components/spaces/space-poll"
import { SpaceGallery } from "@/components/spaces/space-gallery"
import { SpaceMembers } from "@/components/spaces/space-members"
import { PostFeed } from "@/components/posts/post-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSpaceById } from "@/data"
import { MessageSquare, Calendar, Image, Archive, Plus, Filter, Share } from "lucide-react"

const mockPollData = {
  title: "¿Cuál debería ser nuestra próxima lectura?",
  options: [
    { id: "1", text: "La Mano Izquierda de la Oscuridad", votes: 275, percentage: 45 },
    { id: "2", text: "Solaris", votes: 183, percentage: 30 },
    { id: "3", text: "El Problema de los Tres Cuerpos", votes: 110, percentage: 18 },
  ],
  totalVotes: 612,
  timeLeft: "2 días",
}

const mockGalleryItems = [
  { id: "1", title: "Serie: Nebulae 02", image: "/placeholder.svg", author: "Alex", likes: 28 },
  { id: "2", title: "Campos de Luz", image: "/placeholder.svg", author: "Vera", likes: 15 },
  { id: "3", title: "Estudio de Formas", image: "/placeholder.svg", author: "Sofia", likes: 22 },
  { id: "4", title: "Retrato Sintético", image: "/placeholder.svg", author: "Ana", likes: 18 },
  { id: "5", title: "Bocetos Nebulosas", image: "/placeholder.svg", author: "Marco", likes: 12 },
  { id: "6", title: "Interfaces Respirantes", image: "/placeholder.svg", author: "Ilan", likes: 31 },
]

const mockMembers = [
  { id: "5", username: "Lia", avatar: "/moderator-profile.png", role: "moderator" as const, isOnline: true },
  { id: "6", username: "Marco", avatar: "/admin-profile.png", role: "admin" as const, isOnline: false },
  {
    id: "2",
    username: "Nyla",
    avatar: "/writer-profile.png",
    role: "member" as const,
    isOnline: true,
    facet: "Escritora",
  },
  {
    id: "3",
    username: "Sofia",
    avatar: "/curator-profile.png",
    role: "member" as const,
    isOnline: true,
    facet: "Curadora",
  },
  {
    id: "4",
    username: "Ilan",
    avatar: "/developer-profile.png",
    role: "member" as const,
    isOnline: false,
    facet: "Dev Web3",
  },
  {
    id: "7",
    username: "Vera",
    avatar: "/illustrator-profile.png",
    role: "member" as const,
    isOnline: true,
    facet: "Ilustradora",
  },
  {
    id: "8",
    username: "Tadeo",
    avatar: "/reader-profile.png",
    role: "member" as const,
    isOnline: false,
    facet: "Lector",
  },
  {
    id: "9",
    username: "Ana",
    avatar: "/editor-profile.png",
    role: "member" as const,
    isOnline: true,
    facet: "Editora",
  },
]

export default function SpaceDetailPage() {
  const params = useParams()
  const spaceId = params.id as string
  const space = getSpaceById(spaceId)

  if (!space) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Espacio no encontrado</h1>
          <p className="text-muted-foreground">El espacio que buscas no existe o no tienes acceso.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <SpaceHeader space={space} />

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Discusiones
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2">
            <Image className="h-4 w-4" />
            Galería
          </TabsTrigger>
          <TabsTrigger value="archives" className="gap-2">
            <Archive className="h-4 w-4" />
            Archivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Discusiones Principales
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <PostFeed spaceId={spaceId} showCreatePost={true} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Next Event */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Evento Próximo
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Sesión: Hyperion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sesión: Hyperion</h3>
                    <p className="text-sm text-muted-foreground">Jue, 28 Sep • 19:00 GMT-3 • Sala Órbita</p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    03d 12h 45m
                  </Badge>
                </CardContent>
              </Card>

              {/* Active Poll */}
              <SpacePoll
                title={mockPollData.title}
                options={mockPollData.options}
                totalVotes={mockPollData.totalVotes}
                timeLeft={mockPollData.timeLeft}
                onVote={(optionId) => console.log("Voted for:", optionId)}
              />

              {/* Recent Gallery */}
              <SpaceGallery items={mockGalleryItems} />

              {/* Active Members */}
              <SpaceMembers members={mockMembers} totalMembers={space.memberCount} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
            <p className="text-muted-foreground">La sección de eventos estará disponible pronto.</p>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockGalleryItems.map((item) => (
              <Card key={item.id} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="aspect-square">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">por {item.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archives" className="space-y-6">
          <div className="text-center py-12">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
            <p className="text-muted-foreground">La sección de archivos estará disponible pronto.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
