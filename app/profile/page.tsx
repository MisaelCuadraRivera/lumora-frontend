"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useFacets } from "@/hooks/useFacets"
import { useSpaces } from "@/hooks/useSpaces"
import { ProfileHeader } from "@/components/profile/profile-header"
import { FacetCard } from "@/components/profile/facet-card"
import { LivingSpaces } from "@/components/profile/living-spaces"
import { PostFeed } from "@/components/posts/post-feed"
import { CreateFacetModal } from "@/components/profile/create-facet-modal"
import { FacetModal } from "@/components/profile/facet-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const { facets, loading: loadingFacets, refreshFacets, activeFacet } = useFacets()
  const { spaces, loading: loadingSpaces, refreshSpaces } = useSpaces()
  const [editingFacet, setEditingFacet] = useState<any>(null)
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 1. Get custom spaces order from localStorage based on activeFacet
  const storedOrder = typeof window !== 'undefined' && activeFacet
    ? localStorage.getItem(`lumora_spaces_order_${activeFacet.id}`)
    : null
  const orderedIds: string[] = storedOrder ? JSON.parse(storedOrder) : []

  // 2. Sort the spaces according to the stored order
  const sortedSpaces = [...(spaces || [])].sort((a, b) => {
    const indexA = orderedIds.indexOf(a.id)
    const indexB = orderedIds.indexOf(b.id)
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // 3. Map spaces deterministically based on ID to avoid stats jumping on re-renders
  const getDeterministicStats = (spaceId: string, memberCount: number) => {
    let hash = 0
    for (let i = 0; i < spaceId.length; i++) {
      hash = spaceId.charCodeAt(i) + ((hash << 5) - hash)
    }
    const views = Math.abs(hash % 400) + 120
    const likes = Math.abs(hash % 40) + 12
    return {
      views,
      likes,
      members: memberCount || 1,
    }
  }

  const mappedSpaces = sortedSpaces.map((space) => ({
    id: space.id,
    title: space.name,
    description: space.description || "Sin descripción.",
    image: space.image || "/placeholder.svg?height=200&width=300",
    type: (space.category === "proyecto" ? "project" : 
           space.category === "comunidad" ? "collaboration" : 
           space.category === "tienda" ? "portfolio" : "blog") as "portfolio" | "blog" | "collaboration" | "project",
    stats: getDeterministicStats(space.id, space.memberCount)
  }))

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ProfileHeader user={user} isOwner={true} onEdit={() => router.push('/settings')} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Gestiona y muestra tus Facetas</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/profile/facets')}
              className="gap-2 border-primary/25 hover:border-primary/50 text-foreground transition-all"
            >
              <Plus className="h-4 w-4" />
              Gestión Avanzada
            </Button>
            <CreateFacetModal onSuccess={refreshFacets} />
          </div>
        </div>

        {loadingFacets ? (
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
                onEdit={(facetId) => {
                  const facetToEdit = facets.find(f => f.id === facetId)
                  setEditingFacet(facetToEdit)
                }}
                onDelete={() => refreshFacets()}
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {activeFacet && (
        <Tabs defaultValue="spaces" className="space-y-6">
          <TabsList className="w-full flex md:grid md:grid-cols-2 overflow-x-auto whitespace-nowrap scrollbar-none justify-start md:justify-center p-1">
            <TabsTrigger value="spaces" className="gap-2 flex-shrink-0 flex-1 md:flex-initial">Espacios Vivos</TabsTrigger>
            <TabsTrigger value="posts" className="gap-2 flex-shrink-0 flex-1 md:flex-initial">Publicaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="space-y-6">
            {loadingSpaces ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <LivingSpaces 
                facetName={activeFacet.name} 
                spaces={mappedSpaces} 
                facetId={activeFacet.id}
                onRefresh={refreshSpaces}
              />
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <PostFeed showCreatePost={false} />
          </TabsContent>
        </Tabs>
      )}

      {editingFacet && (
        <FacetModal
          isOpen={!!editingFacet}
          onClose={() => setEditingFacet(null)}
          mode="edit"
          facet={editingFacet}
          onSuccess={refreshFacets}
        />
      )}
    </div>
  )
}
