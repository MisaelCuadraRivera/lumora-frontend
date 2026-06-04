"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/types"
import { Share, Edit } from "lucide-react"
import { ProfileStats } from "@/components/social/profile-stats"
import { SocialActions } from "@/components/social/social-actions"

interface ProfileHeaderProps {
  user: User
  isOwner?: boolean
  onEdit?: () => void
  onFollowChange?: (userId: string, isFollowing: boolean) => void
  onBlockChange?: (userId: string, isBlocked: boolean) => void
}

export function ProfileHeader({ 
  user, 
  isOwner = false, 
  onEdit, 
  onFollowChange, 
  onBlockChange 
}: ProfileHeaderProps) {
  const activeFacet = user.facets.find((f) => f.isActive)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.username} en Lumora`,
        url: `/user/${user.username}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/user/${user.username}`)
      // Fallback simple alert if toast is not directly available, but let's assume standard behavior
    }
  }

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 sm:h-48 bg-primary/10 rounded-lg overflow-hidden relative shadow-inner">
        <div className="w-full h-full bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fdaBa-png')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
      </div>

      {/* Profile Info Card */}
      <Card className="relative -mt-12 sm:-mt-16 mx-3 sm:mx-6 border-border/40 bg-card/85 backdrop-blur-md shadow-xl transition-all duration-300">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            {/* Left section: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full flex-1">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1 min-w-0 w-full">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">@{user.username}</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-1 max-w-lg mx-auto sm:mx-0">
                    {user.bio || "Sin biografía"}
                  </p>
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {activeFacet && (
                    <Badge variant="default" className="gap-1.5 py-1 px-3 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Viendo la Faceta: {activeFacet.name}
                    </Badge>
                  )}
                  {user.isOnline && (
                    <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      En línea
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="pt-3 border-t border-border/40 w-full flex justify-center sm:justify-start">
                  <ProfileStats user={user} />
                </div>
              </div>
            </div>

            {/* Right section: Action Buttons */}
            <div className="flex items-center justify-center w-full sm:w-auto flex-shrink-0 pt-4 sm:pt-2 border-t sm:border-t-0 border-border/20">
              {isOwner ? (
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="w-full sm:w-auto h-9 text-xs font-medium"
                  >
                    <Share className="h-3.5 w-3.5 mr-2" />
                    Compartir
                  </Button>
                  <Button 
                    onClick={onEdit}
                    className="w-full sm:w-auto h-9 text-xs font-medium"
                  >
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Editar perfil
                  </Button>
                </div>
              ) : (
                <div className="w-full flex justify-center sm:justify-end">
                  <SocialActions targetUser={user} onFollowChange={onFollowChange} onBlockChange={onBlockChange} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
