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
        "border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:bg-card/80 hover:shadow-lg cursor-pointer",
        isActive && "ring-2 ring-primary/50 shadow-md",
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          {/* Icono y información principal */}
          <div className="flex items-center gap-4 flex-1">
            <div
              className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                facetColors[facet.category],
              )}
            >
              <span className="text-2xl">{facetIcons[facet.category]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-foreground truncate">{facet.name}</h3>
                {isActive ? (
                  <Badge variant="default" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Alterno
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {facet.description}
              </p>
            </div>
          </div>
          
          {/* Switch de activación */}
          {isOwner && (
            <div className="flex items-center">
              <Switch 
                checked={isActive} 
                onCheckedChange={handleToggleActive}
                className="ml-2"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs capitalize px-3 py-1 font-medium border-2",
                isActive && "border-primary/30 text-primary bg-primary/5"
              )}
            >
              {facet.category}
            </Badge>
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Faceta activa" />
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView?.(facet.id)}
              className="hover:bg-primary/10 transition-colors"
              title="Ver faceta"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isOwner && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit?.(facet.id)}
                className="hover:bg-primary/10 transition-colors"
                title="Editar faceta"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
