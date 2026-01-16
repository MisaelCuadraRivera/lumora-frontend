"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FacetDetailModal } from "@/components/profile/facet-detail-modal"
import { useFacets } from "@/hooks/useFacets"
import { useToast } from "@/hooks/use-toast"
import type { Facet } from "@/types"
import { Edit, Eye, Loader2 } from "lucide-react"
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
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { toggleFacet } = useFacets()
  const { toast } = useToast()

  // Sincronizar estado local con el prop
  useEffect(() => {
    setIsActive(facet.isActive)
  }, [facet.isActive])

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isToggling) return
    
    setIsToggling(true)
    const newState = !isActive
    
    try {
      const result = await toggleFacet(facet.id)
      
      if (result.success) {
        setIsActive(newState)
        onActivate?.(facet.id)
        toast({
          title: newState ? "Faceta activada" : "Faceta desactivada",
          description: `La faceta "${facet.name}" ha sido ${newState ? 'activada' : 'desactivada'}.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo cambiar el estado de la faceta.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al cambiar el estado.",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  const handleCardClick = () => {
    setShowDetailModal(true)
    onView?.(facet.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(facet.id)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetailModal(true)
    onView?.(facet.id)
  }

  return (
    <>
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative border-2 bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden",
          isActive 
            ? "border-primary/50 shadow-lg hover:border-primary/70" 
            : "border-border/40 hover:border-border/60"
        )}
      >
        {/* Indicador de activo en la esquina */}
        {isActive && (
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-primary/20 border-l-transparent" />
        )}

        <CardHeader className="pt-6 px-6 pb-4 space-y-3">
          <div className="flex items-center gap-4">
            {/* Icono con animación */}
            <div
              className={cn(
                "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                facetColors[facet.category],
              )}
            >
              <span className="text-3xl">{facetIcons[facet.category]}</span>
            </div>
            
            {/* Información principal */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="font-bold text-lg text-foreground truncate">{facet.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {facet.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0 space-y-3">
          {/* Categoría */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs capitalize px-3 py-1 font-medium",
                isActive && "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              {facet.category}
            </Badge>
          </div>

          {/* Separador */}
          <div className="h-px bg-border/50" />
          
          {/* Acciones */}
          {isOwner && (
            <div className="flex items-center justify-between gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewDetails}
                className="flex-1 h-9 text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Ver detalles
              </Button>
              
              <div 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all duration-200",
                  isActive 
                    ? "" 
                    : " "
                )}
                onClick={handleToggleActive}
                title={isToggling ? "Cambiando..." : (isActive ? "Desactivar faceta" : "Activar faceta")}
              >
                {isToggling ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <>
                    <Switch 
                      checked={isActive} 
                      onCheckedChange={() => {}}
                      disabled={isToggling}
                      className={cn(
                        "data-[state=unchecked]:bg-foreground/80 dark:data-[state=unchecked]:bg-white/90",
                        "data-[state=checked]:bg-primary"
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FacetDetailModal 
        facet={facet}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  )
}
