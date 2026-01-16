"use client"

import { useAuth } from "@/lib/auth"
import { useFacets } from "@/hooks/useFacets"
import { ProfileHeader } from "@/components/profile/profile-header"
import { FacetCard } from "@/components/profile/facet-card"
import { LivingSpaces } from "@/components/profile/living-spaces"
import { PostFeed } from "@/components/posts/post-feed"
import { CreateFacetModal } from "@/components/profile/create-facet-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

const mockLivingSpaces = [
  {
    id: "1",
    title: "Portfolio Digital",
    description: "Colección de mis trabajos de arte digital y generativo más recientes.",
    image: "/placeholder.svg?height=200&width=300",
    type: "portfolio" as const,
    stats: { views: 1250, likes: 89 },
  },
  {
    id: "2",
    title: "Blog Creativo",
    description: "Reflexiones sobre el proceso creativo y la intersección entre arte y tecnología.",
    image: "/placeholder.svg?height=200&width=300",
    type: "blog" as const,
    stats: { views: 890, comments: 23 },
  },
  {
    id: "3",
    title: "Colaboraciones & Proyectos",
    description: "Proyectos colaborativos con otros artistas y desarrolladores.",
    image: "/placeholder.svg?height=200&width=300",
    type: "collaboration" as const,
    stats: { members: 5 },
  },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { facets, loading, refreshFacets, activeFacet } = useFacets()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ProfileHeader user={user} isOwner={true} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Gestiona y muestra tus Facetas</h2>
          <CreateFacetModal onSuccess={refreshFacets} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : facets.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              No tienes facetas creadas aún.
            </p>
            <CreateFacetModal 
              onSuccess={refreshFacets}
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear tu primera Faceta
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facets.map((facet) => (
              <FacetCard
                key={facet.id}
                facet={facet}
                isOwner={true}
                onActivate={() => refreshFacets()}
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {activeFacet && (
        <Tabs defaultValue="spaces" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spaces">Espacios Vivos</TabsTrigger>
            <TabsTrigger value="posts">Publicaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="space-y-6">
            <LivingSpaces facetName={activeFacet.name} spaces={mockLivingSpaces} />
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <PostFeed showCreatePost={false} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
