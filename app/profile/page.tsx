"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { ProfileHeader } from "@/components/profile/profile-header"
import { FacetCard } from "@/components/profile/facet-card"
import { LivingSpaces } from "@/components/profile/living-spaces"
import { PostFeed } from "@/components/posts/post-feed"
import { CreateFacetModal } from "@/components/profile/create-facet-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

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
  const [selectedFacet, setSelectedFacet] = useState(user?.facets.find((f) => f.isActive)?.id || "")
  const [userFacets, setUserFacets] = useState(user?.facets || [])

  if (!user) {
    return <div>Cargando...</div>
  }

  const activeFacet = userFacets.find((f) => f.id === selectedFacet) || userFacets.find((f) => f.isActive)

  const handleFacetCreated = (newFacet: any) => {
    setUserFacets(prev => [...prev, newFacet])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <ProfileHeader user={user} isOwner={true} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Gestiona y muestra tus Facetas</h2>
          <CreateFacetModal onFacetCreated={handleFacetCreated} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userFacets.map((facet) => (
            <FacetCard
              key={facet.id}
              facet={facet}
              isOwner={true}
              onActivate={(facetId) => setSelectedFacet(facetId)}
              onView={(facetId) => setSelectedFacet(facetId)}
            />
          ))}
        </div>
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
