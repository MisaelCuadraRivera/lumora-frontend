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
  creative: "🎨",
  profesional: "💼",
  professional: "💼",
  viajero: "🌍",
  traveler: "🌍",
  gamer: "🎮",
  escritor: "✍️",
  writer: "✍️",
  personal: "👤",
  social: "👥",
  fan: "❤️",
  photographer: "📷",
  musician: "🎵",
  developer: "💻",
  otro: "⭐",
  other: "⭐"
}

const facetColors = {
  artista: "bg-purple-500 text-white",
  creative: "bg-purple-500 text-white",
  profesional: "bg-blue-500 text-white",
  professional: "bg-blue-500 text-white",
  viajero: "bg-green-500 text-white",
  traveler: "bg-green-500 text-white",
  gamer: "bg-red-500 text-white",
  escritor: "bg-indigo-500 text-white",
  writer: "bg-indigo-500 text-white",
  personal: "bg-sky-500 text-white",
  social: "bg-pink-500 text-white",
  fan: "bg-rose-500 text-white",
  photographer: "bg-teal-500 text-white",
  musician: "bg-orange-500 text-white",
  developer: "bg-slate-700 text-white",
  otro: "bg-gray-500 text-white",
  other: "bg-gray-500 text-white"
}

const categoryLabels = {
  artista: "Artista",
  creative: "Creador/Artista",
  profesional: "Profesional",
  professional: "Profesional",
  viajero: "Viajero",
  traveler: "Viajero",
  gamer: "Gamer",
  escritor: "Escritor",
  writer: "Escritor",
  personal: "Personal",
  social: "Social",
  fan: "Fan",
  photographer: "Fotógrafo",
  musician: "Músico",
  developer: "Desarrollador",
  otro: "Otro",
  other: "Otro"
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
                  "text-white text-2xl font-bold",
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
