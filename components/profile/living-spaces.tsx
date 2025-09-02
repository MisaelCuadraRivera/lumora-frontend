"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Grid3X3, Send, Users, Calendar } from "lucide-react"

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

export function LivingSpaces({ facetName, spaces }: LivingSpacesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Espacios Vivos — Faceta {facetName}</h2>
        <Button variant="outline" size="sm">
          Arrastra para reorganizar tus espacios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => {
          const IconComponent = spaceTypeIcons[space.type]
          return (
            <Card
              key={space.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-colors cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {spaceTypeLabels[space.type]}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{space.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {space.image && (
                  <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                    <img
                      src={space.image || "/placeholder.svg"}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">{space.description}</p>

                {space.stats && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {space.stats.views && <span>{space.stats.views} vistas</span>}
                    {space.stats.likes && <span>{space.stats.likes} likes</span>}
                    {space.stats.members && (
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
                          <AvatarImage src={`/generic-placeholder-graphic.png?key=${i}`} />
                          <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">+2 colaboradores</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {/* Add New Space Card */}
        <Card className="border-dashed border-2 border-border/50 bg-transparent hover:bg-card/20 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Grid3X3 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Crear nuevo Espacio</p>
            <p className="text-xs text-muted-foreground">Agrega un nuevo proyecto o portfolio</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
