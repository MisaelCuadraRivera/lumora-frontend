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
import { Edit, Eye, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FacetCardProps {
  facet: Facet
  isOwner?: boolean
  onActivate?: (facetId: string) => void
  onEdit?: (facetId: string) => void
  onDelete?: (facetId: string) => void
  onView?: (facetId: string) => void
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

export function FacetCard({ facet, isOwner = false, onActivate, onEdit, onDelete, onView }: FacetCardProps) {
  const [isActive, setIsActive] = useState(facet.isActive)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { toggleFacet, deleteFacet } = useFacets()
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const result = await deleteFacet(facet.id)
      if (result.success) {
        toast({
          title: "Faceta eliminada",
          description: `La faceta "${facet.name}" ha sido eliminada.`,
        })
        onDelete?.(facet.id)
      } else {
        throw new Error(result.message || "Error al eliminar la faceta")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar la faceta.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
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

        {/* Switch de activación en la esquina superior derecha */}
        {isOwner && (
          <div 
            className="absolute top-4 right-4 z-20 flex items-center justify-center h-8 w-12 hover:bg-sidebar-accent/20 rounded-md transition-colors cursor-pointer"
            onClick={handleToggleActive}
            title={isToggling ? "Cambiando..." : (isActive ? "Desactivar faceta" : "Activar faceta")}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Switch 
                checked={isActive} 
                onCheckedChange={() => {}}
                disabled={isToggling}
                className="data-[state=unchecked]:bg-foreground/50 dark:data-[state=unchecked]:bg-white/50 data-[state=checked]:bg-primary scale-90"
              />
            )}
          </div>
        )}

        <CardHeader className="pt-6 px-6 pb-4 space-y-3">
          <div className="flex items-center gap-4">
            {/* Icono con animación */}
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewDetails}
                className="flex-1 h-9 text-xs hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Detalles
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
                className="h-9 w-9 p-0 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shrink-0"
                title="Editar faceta"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="h-9 w-9 p-0 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all shrink-0"
                title="Eliminar faceta"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FacetDetailModal 
        facet={facet}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la faceta "{facet.name}" y todos sus espacios asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(false)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
