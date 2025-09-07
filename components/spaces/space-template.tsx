"use client"

import { SpaceHeader } from "@/components/spaces/space-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PostFeed } from "@/components/posts/post-feed"
import { SpaceMembers } from "@/components/spaces/space-members"
import { SpaceGallery } from "@/components/spaces/space-gallery"
import { SpacePoll } from "@/components/spaces/space-poll"
import { MusicSpace } from "@/components/spaces/music-space"
import { TechSpace } from "@/components/spaces/tech-space"
import { MarketplaceSpace } from "@/components/spaces/marketplace-space"
import { 
  MessageSquare, 
  Calendar, 
  Image, 
  Archive, 
  Plus, 
  Filter, 
  Share,
  ShoppingCart,
  Music,
  Code,
  BookOpen,
  Users,
  Store,
  Camera,
  Mic,
  Laptop,
  Heart,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Play,
  Pause,
  Download,
  Upload
} from "lucide-react"
import type { Space } from "@/types"

interface SpaceTemplateProps {
  space: Space
  spaceId: string
}

// Configuración de plantillas para cada tipo de espacio
const spaceTemplates = {
  comunidad: {
    name: "Comunidad",
    icon: Users,
    color: "bg-blue-500",
    tabs: [
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "events", label: "Eventos", icon: Calendar },
      { id: "gallery", label: "Galería", icon: Image },
      { id: "members", label: "Miembros", icon: Users }
    ],
    sidebar: ["poll", "event", "gallery", "members"]
  },
  proyecto: {
    name: "Proyecto",
    icon: Code,
    color: "bg-green-500",
    tabs: [
      { id: "overview", label: "Resumen", icon: TrendingUp },
      { id: "tasks", label: "Tareas", icon: Clock },
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "files", label: "Archivos", icon: Archive }
    ],
    sidebar: ["progress", "tasks", "members", "files"]
  },
  club: {
    name: "Club de Fans",
    icon: Heart,
    color: "bg-pink-500",
    tabs: [
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "events", label: "Eventos", icon: Calendar },
      { id: "gallery", label: "Galería", icon: Image },
      { id: "members", label: "Miembros", icon: Users }
    ],
    sidebar: ["poll", "event", "gallery", "members"]
  },
  tienda: {
    name: "Marketplace",
    icon: Store,
    color: "bg-purple-500",
    tabs: [
      { id: "products", label: "Productos", icon: ShoppingCart },
      { id: "orders", label: "Pedidos", icon: Archive },
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "reviews", label: "Reseñas", icon: Star }
    ],
    sidebar: ["featured", "categories", "recent", "members"]
  },
  evento: {
    name: "Evento",
    icon: Calendar,
    color: "bg-orange-500",
    tabs: [
      { id: "overview", label: "Resumen", icon: Calendar },
      { id: "schedule", label: "Programa", icon: Clock },
      { id: "attendees", label: "Asistentes", icon: Users },
      { id: "discussions", label: "Discusiones", icon: MessageSquare }
    ],
    sidebar: ["schedule", "attendees", "poll", "gallery"]
  },
  galeria: {
    name: "Galería",
    icon: Camera,
    color: "bg-indigo-500",
    tabs: [
      { id: "gallery", label: "Galería", icon: Image },
      { id: "collections", label: "Colecciones", icon: Archive },
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "members", label: "Artistas", icon: Users }
    ],
    sidebar: ["featured", "recent", "collections", "members"]
  },
  musica: {
    name: "Música",
    icon: Music,
    color: "bg-red-500",
    tabs: [
      { id: "playlist", label: "Playlist", icon: Music },
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "events", label: "Conciertos", icon: Calendar },
      { id: "members", label: "Miembros", icon: Users }
    ],
    sidebar: ["now-playing", "playlist", "events", "members"]
  },
  tecnologia: {
    name: "Tecnología",
    icon: Laptop,
    color: "bg-cyan-500",
    tabs: [
      { id: "discussions", label: "Discusiones", icon: MessageSquare },
      { id: "projects", label: "Proyectos", icon: Code },
      { id: "resources", label: "Recursos", icon: Archive },
      { id: "members", label: "Miembros", icon: Users }
    ],
    sidebar: ["trending", "projects", "resources", "members"]
  }
}

export function SpaceTemplate({ space, spaceId }: SpaceTemplateProps) {
  const template = spaceTemplates[space.category as keyof typeof spaceTemplates] || spaceTemplates.comunidad
  const TemplateIcon = template.icon

  // Datos mock para diferentes tipos de espacios
  const mockData = {
    poll: {
      title: "¿Cuál debería ser nuestra próxima lectura?",
      options: [
        { id: "1", text: "La Mano Izquierda de la Oscuridad", votes: 275, percentage: 45 },
        { id: "2", text: "Solaris", votes: 183, percentage: 30 },
        { id: "3", text: "El Problema de los Tres Cuerpos", votes: 110, percentage: 18 },
      ],
      totalVotes: 612,
      timeLeft: "2 días",
    },
    gallery: [
      { id: "1", title: "Serie: Nebulae 02", image: "/placeholder.svg", author: "Alex", likes: 28 },
      { id: "2", title: "Campos de Luz", image: "/placeholder.svg", author: "Vera", likes: 15 },
      { id: "3", title: "Estudio de Formas", image: "/placeholder.svg", author: "Sofia", likes: 22 },
    ],
    members: [
      { id: "1", username: "Lia", avatar: "/moderator-profile.png", role: "moderator" as const, isOnline: true },
      { id: "2", username: "Marco", avatar: "/admin-profile.png", role: "admin" as const, isOnline: false },
      { id: "3", username: "Nyla", avatar: "/writer-profile.png", role: "member" as const, isOnline: true },
    ]
  }

  const renderSidebar = () => {
    return (
      <div className="space-y-6">
        {template.sidebar.map((item, index) => {
          switch (item) {
            case "poll":
              return (
                <SpacePoll
                  key={index}
                  title={mockData.poll.title}
                  options={mockData.poll.options}
                  totalVotes={mockData.poll.totalVotes}
                  timeLeft={mockData.poll.timeLeft}
                  onVote={(optionId) => console.log("Voted for:", optionId)}
                />
              )
            case "gallery":
              return <SpaceGallery key={index} items={mockData.gallery} />
            case "members":
              return <SpaceMembers key={index} members={mockData.members} totalMembers={space.memberCount} />
            case "event":
              return (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Próximo Evento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                      <img src="/placeholder.svg" alt="Evento" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sesión: Hyperion</h3>
                      <p className="text-sm text-muted-foreground">Jue, 28 Sep • 19:00 GMT-3</p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      03d 12h 45m
                    </Badge>
                  </CardContent>
                </Card>
              )
            default:
              return null
          }
        })}
      </div>
    )
  }

  const renderTabContent = (tabId: string) => {
    // Renderizar componentes específicos según el tipo de espacio
    if (space.category === 'musica' && tabId === 'playlist') {
      return <MusicSpace spaceId={spaceId} />
    }
    
    if (space.category === 'tecnologia' && (tabId === 'projects' || tabId === 'resources')) {
      return <TechSpace spaceId={spaceId} />
    }
    
    if (space.category === 'tienda' && (tabId === 'products' || tabId === 'orders')) {
      return <MarketplaceSpace spaceId={spaceId} />
    }

    switch (tabId) {
      case "discussions":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
              {renderSidebar()}
            </div>
          </div>
        )
      
      case "gallery":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockData.gallery.map((item) => (
              <Card key={item.id} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="aspect-square">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">por {item.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      
      case "members":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockData.members.map((member) => (
              <Card key={member.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt={member.username} className="w-12 h-12 rounded-full" />
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{member.username}</p>
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      
      default:
        return (
          <div className="text-center py-12">
            <TemplateIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
            <p className="text-muted-foreground">Esta sección estará disponible pronto.</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <SpaceHeader space={space} spaceId={spaceId} />

      <Tabs defaultValue={template.tabs[0].id} className="space-y-6">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${template.tabs.length}, 1fr)` }}>
          {template.tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {template.tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {renderTabContent(tab.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
