"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/types"
import { Share, Edit, MessageCircle, UserPlus } from "lucide-react"

interface ProfileHeaderProps {
  user: User
  isOwner?: boolean
  onEdit?: () => void
  onMessage?: () => void
  onFollow?: () => void
}

export function ProfileHeader({ user, isOwner = false, onEdit, onMessage, onFollow }: ProfileHeaderProps) {
  const activeFacet = user.facets.find((f) => f.isActive)

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg overflow-hidden">
        <div className="w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fdaBa-png')] bg-cover bg-center opacity-60"></div>
      </div>

      {/* Profile Info */}
      <Card className="relative -mt-16 mx-4 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold">@{user.username}</h1>
                  <p className="text-muted-foreground">{user.bio || "Sin biografía"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {activeFacet && (
                    <Badge variant="default" className="gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Viendo la Faceta: {activeFacet.name}
                    </Badge>
                  )}
                  {user.isOnline && (
                    <Badge variant="secondary" className="gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      En línea
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              {isOwner ? (
                <Button onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onMessage}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mensaje
                  </Button>
                  <Button onClick={onFollow}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
