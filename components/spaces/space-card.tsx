"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Space } from "@/types"
import { Users, UserPlus, UserCheck, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpaceCardProps {
  space: Space
  onJoin?: (spaceId: string) => void
  onLeave?: (spaceId: string) => void
}

export function SpaceCard({ space, onJoin, onLeave }: SpaceCardProps) {
  const [isJoined, setIsJoined] = useState(space.isJoined)
  const [memberCount, setMemberCount] = useState(space.memberCount)

  const handleToggleJoin = () => {
    if (isJoined) {
      setIsJoined(false)
      setMemberCount(memberCount - 1)
      onLeave?.(space.id)
    } else {
      setIsJoined(true)
      setMemberCount(memberCount + 1)
      onJoin?.(space.id)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-200 group">
      <CardHeader className="pb-3">
        {space.banner && (
          <div className="aspect-video rounded-lg overflow-hidden mb-4 -mx-6 -mt-6">
            <img src={space.banner || "/placeholder.svg"} alt={space.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={space.image || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {space.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{space.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {space.category}
                </Badge>
                {space.activeMembers > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{space.activeMembers} activos</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant={isJoined ? "outline" : "default"}
            size="sm"
            onClick={handleToggleJoin}
            className={cn("gap-2", isJoined && "hover:bg-destructive hover:text-destructive-foreground")}
          >
            {isJoined ? (
              <>
                <UserCheck className="h-4 w-4" />
                <span className="group-hover:hidden">Unido</span>
                <span className="hidden group-hover:inline">Salir</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Unirse
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{space.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{memberCount.toLocaleString()} miembros</span>
            </div>
            {space.activeMembers > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">{space.activeMembers} en línea</span>
              </div>
            )}
          </div>
        </div>

        {space.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {space.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {space.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{space.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
