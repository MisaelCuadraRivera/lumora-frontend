"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { Facet } from "@/types"
import { Edit, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface FacetCardProps {
  facet: Facet
  isOwner?: boolean
  onActivate?: (facetId: string) => void
  onEdit?: (facetId: string) => void
  onView?: (facetId: string) => void
}

const facetIcons = {
  artista: "🎨",
  profesional: "💼",
  viajero: "🌍",
  gamer: "🎮",
  escritor: "✍️",
  otro: "⭐",
}

const facetColors = {
  artista: "from-purple-500 to-pink-500",
  profesional: "from-blue-500 to-cyan-500",
  viajero: "from-green-500 to-emerald-500",
  gamer: "from-red-500 to-orange-500",
  escritor: "from-indigo-500 to-purple-500",
  otro: "from-gray-500 to-slate-500",
}

export function FacetCard({ facet, isOwner = false, onActivate, onEdit, onView }: FacetCardProps) {
  const [isActive, setIsActive] = useState(facet.isActive)

  const handleToggleActive = () => {
    setIsActive(!isActive)
    onActivate?.(facet.id)
  }

  return (
    <Card
      className={cn(
        "border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/60",
        isActive && "ring-2 ring-primary/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center",
                facetColors[facet.category],
              )}
            >
              <span className="text-xl">{facetIcons[facet.category]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{facet.name}</h3>
                {isActive && (
                  <Badge variant="default" className="text-xs">
                    Activo
                  </Badge>
                )}
                {!isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Alterno
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{facet.description}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={handleToggleActive} />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs capitalize">
            {facet.category}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onView?.(facet.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            {isOwner && (
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(facet.id)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
