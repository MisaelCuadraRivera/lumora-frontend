"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Space } from "@/types"
import { Users, UserPlus, UserCheck, Share, Settings, TrendingUp, ListChecks } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSpace } from "@/hooks/useSpace"
import { toast } from "sonner"

interface SpaceHeaderProps {
  space: Space
  spaceId: string
}

export function SpaceHeader({ space, spaceId }: SpaceHeaderProps) {
  const [isJoined, setIsJoined] = useState(space.isJoined || false)
  const router = useRouter()
  const { joinSpace, leaveSpace } = useSpace(spaceId)

  const handleToggleJoin = async () => {
    try {
      if (isJoined) {
        const result = await leaveSpace()
        if (result.success) {
          setIsJoined(false)
          toast.success(result.message || "Has salido del espacio")
        } else {
          toast.error(result.message || "Error saliendo del espacio")
        }
      } else {
        const result = await joinSpace()
        if (result.success) {
          setIsJoined(true)
          toast.success(result.message || "Te has unido al espacio")
        } else {
          toast.error(result.message || "Error uniéndose al espacio")
        }
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  const isOwner = space.ownerId === space.owner?.id // Asumiendo que tenemos el usuario actual

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg overflow-hidden">
        {space.banner ? (
          <img src={space.banner || "/placeholder.svg"} alt={space.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-cyan-500/20"></div>
        )}
      </div>

      {/* Space Info */}
      <Card className="relative -mt-16 mx-4 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={space.image || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {space.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold">{space.name}</h1>
                  <p className="text-muted-foreground">{space.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Miembros: {space.memberCount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Activos ahora: {space.activeMembers || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{space.category}</Badge>
                  {(space.tags || []).slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/spaces/${space.id}/tasks`)}>
                <ListChecks className="h-4 w-4 mr-2" />
                Tareas
              </Button>
              {isOwner ? (
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              ) : (
                <Button onClick={handleToggleJoin} variant={isJoined ? "outline" : "default"}>
                  {isJoined ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Salir del Espacio
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Unirse al Espacio
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
