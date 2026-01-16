"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { Facet } from "@/types"
import { Calendar, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FacetDetailModalProps {
  facet: Facet | null
  isOpen: boolean
  onClose: () => void
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

const categoryLabels = {
  artista: "Artista",
  profesional: "Profesional",
  viajero: "Viajero",
  gamer: "Gamer",
  escritor: "Escritor",
  otro: "Otro",
}

export function FacetDetailModal({ facet, isOpen, onClose }: FacetDetailModalProps) {
  if (!facet) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalles
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con Avatar y Nombre */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={facet.avatar || "/placeholder.svg"} />
              <AvatarFallback 
                className={cn(
                  "bg-gradient-to-br text-white text-2xl font-bold",
                  facetColors[facet.category]
                )}
              >
                {facet.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{facet.name}</h2>
                {facet.isActive && (
                  <Badge variant="default" className="text-black bg-green-400">
                    Activa
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  <span className="mr-1">{facetIcons[facet.category]}</span>
                  {categoryLabels[facet.category]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <Card className="bg-muted/50">
            <CardContent >
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Descripción</h3>
              <p className="text-base leading-relaxed">{facet.description}</p>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50">
              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-muted-foreground">Estado</h4>
                </div>
                <p className="text-sm font-medium">
                  {facet.isActive ? "Faceta Activa" : "Faceta Alterna"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-muted-foreground">Categoría</h4>
                </div>
                <p className="text-sm font-medium capitalize">{categoryLabels[facet.category]}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
