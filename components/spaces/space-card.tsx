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
    <Card className="border-border bg-card transition-colors duration-200 overflow-hidden h-full flex flex-col">
      {/* Banner Image - Full Width Top */}
      {space.banner && (
        <div className="aspect-[2/1] w-full overflow-hidden">
          <img 
            src={space.banner || "/placeholder.svg"} 
            alt={space.name} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      {/* Main Content - Flex Grow */}
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {/* Header Section - Avatar and Title */}
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <Avatar className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0">
            <AvatarImage src={space.image || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary text-base md:text-lg font-semibold">
              {space.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg md:text-xl leading-tight text-foreground mb-3">{space.name}</h3>
            
            {/* Category and Active Status */}
            <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-4">
              <Badge variant="outline" className="text-xs font-medium flex-shrink-0">
                {space.category}
              </Badge>
              {space.activeMembers > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-medium whitespace-nowrap">{space.activeMembers} activos ahora</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description - Fixed Height */}
        <div className="mb-4 md:mb-5">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 h-[3.6rem]">
            {space.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center flex-wrap gap-4 md:gap-6 mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-semibold text-sm text-foreground">
              {memberCount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">miembros</span>
          </div>
          {space.activeMembers > 0 && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-semibold text-sm text-green-600">
                {space.activeMembers}
              </span>
              <span className="text-xs text-muted-foreground">en línea</span>
            </div>
          )}
        </div>

        {/* Tags Section - Flex Grow */}
        <div className="flex-1 flex items-start">
          {space.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {space.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs px-2.5 py-1 font-medium hover:bg-secondary/80 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
              {space.tags.length > 3 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2.5 py-1 font-medium text-muted-foreground"
                >
                  +{space.tags.length - 3} más
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Button - Always at Bottom */}
      <div className="px-4 md:px-6 pb-4 md:pb-6 mt-auto">
        <Button
          variant={isJoined ? "secondary" : "default"}
          size="lg"
          onClick={handleToggleJoin}
          className="w-full font-medium"
        >
          {isJoined ? (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Miembro
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Unirse
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
