"use client"

import { useParams } from "next/navigation"
import { SpaceTemplate } from "@/components/spaces/space-template"
import { useSpace } from "@/hooks/useSpace"
import { Skeleton } from "@/components/ui/skeleton"

export default function SpaceDetailPage() {
  const params = useParams()
  const spaceId = params.id as string
  const { space, loading, error } = useSpace(spaceId)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

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

  return <SpaceTemplate space={space} spaceId={spaceId} />
}
