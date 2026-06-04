"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Grid3X3, Send, Users, Calendar, Loader2 } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useSpaces } from "@/hooks/useSpaces"
import { useToast } from "@/hooks/use-toast"
import { CreateSpaceModal } from "@/components/spaces/create-space-modal"
import { cn } from "@/lib/utils"

interface LivingSpace {
  id: string
  title: string
  description: string
  image?: string
  type: "portfolio" | "blog" | "collaboration" | "project"
  stats?: {
    views?: number
    likes?: number
    comments?: number
    members?: number
  }
  lastUpdate?: Date
}

interface LivingSpacesProps {
  facetName: string
  spaces: LivingSpace[]
  facetId?: string
  onRefresh?: () => void
}

const spaceTypeIcons = {
  portfolio: Grid3X3,
  blog: Send,
  collaboration: Users,
  project: Calendar,
}

const spaceTypeLabels = {
  portfolio: "Portfolio",
  blog: "Blog",
  collaboration: "Colaboración",
  project: "Proyecto",
}

export function LivingSpaces({ facetName, spaces, facetId, onRefresh }: LivingSpacesProps) {
  const [localSpaces, setLocalSpaces] = useState<LivingSpace[]>(spaces)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { toast } = useToast()
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)

  // Sincronizar el estado local cuando cambien los props (por ejemplo al cambiar de faceta)
  useEffect(() => {
    setLocalSpaces(spaces)
  }, [spaces])

  const handleDragEnd = async (result: any) => {
    // Si se soltó fuera del contenedor droppable
    if (!result.destination) return

    // Si no cambió de posición
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return
    }

    const items = Array.from(localSpaces)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Actualización local e instantánea de la UI
    setLocalSpaces(items)
    setIsUpdatingOrder(true)

    try {
      const orderedIds = items.map(s => s.id)
      
      // Guardar el orden personalizado localmente por faceta
      if (typeof window !== 'undefined' && facetId) {
        localStorage.setItem(`lumora_spaces_order_${facetId}`, JSON.stringify(orderedIds))
        
        toast({
          title: "¡Orden guardado exitosamente!",
          description: "La cuadrícula de espacios se ha reconfigurado localmente.",
        })
        
        // Notificar al componente padre para mantener el estado ordenado
        onRefresh?.()
      }
    } catch (err: any) {
      toast({
        title: "Error al ordenar",
        description: "No se pudo guardar la posición en tu navegador.",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingOrder(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Espacios Vivos — Faceta {facetName}
            {isUpdatingOrder && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personaliza el orden de tus espacios arrastrando las tarjetas.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/25 text-primary py-1 px-3">
          Arrastra para reorganizar
        </Badge>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="spaces-grid" direction="horizontal" type="GRID">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {localSpaces.map((space, index) => {
                const IconComponent = spaceTypeIcons[space.type] || Grid3X3

                return (
                  <Draggable key={space.id} draggableId={space.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        className={cn(
                          "transition-all duration-200 select-none",
                          snapshot.isDragging && "scale-105 rotate-1 shadow-2xl z-50 ring-2 ring-primary/30 bg-card/90 backdrop-blur-md"
                        )}
                      >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-colors cursor-grab active:cursor-grabbing h-full flex flex-col justify-between">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-5 w-5 text-primary" />
                                <Badge variant="secondary" className="text-xs">
                                  {spaceTypeLabels[space.type] || "Espacio"}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardTitle className="text-lg mt-2 truncate">{space.title}</CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              {space.image && (
                                <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                                  <img
                                    src={space.image || "/placeholder.svg"}
                                    alt={space.title}
                                    className="w-full h-full object-cover pointer-events-none"
                                  />
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground line-clamp-2">{space.description}</p>
                            </div>

                            <div className="pt-2">
                              {space.stats && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                  {space.stats.views !== undefined && <span>{space.stats.views} vistas</span>}
                                  {space.stats.likes !== undefined && <span>{space.stats.likes} likes</span>}
                                  {space.stats.members !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{space.stats.members}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {space.type === "collaboration" && (
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                        <AvatarImage src={`/diverse-user-avatars.png`} />
                                        <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">+2 colaboradores</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}

              {/* Crear nuevo Espacio Card */}
              <Card 
                onClick={() => setShowCreateModal(true)}
                className="border-dashed border-2 border-border/50 bg-transparent hover:bg-card/20 transition-all cursor-pointer flex items-center justify-center min-h-[220px] select-none hover:border-primary/50 group"
              >
                <div className="text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110">
                    <Grid3X3 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium transition-colors group-hover:text-primary">Crear nuevo Espacio</p>
                  <p className="text-xs text-muted-foreground">Agrega un nuevo proyecto o portfolio</p>
                </div>
              </Card>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modal de Creación */}
      <CreateSpaceModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        facetId={facetId}
        onSuccess={onRefresh}
      />
    </div>
  )
}
