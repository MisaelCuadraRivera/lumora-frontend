"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Grid3X3, ExternalLink } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  image: string
  author: string
  likes: number
}

interface SpaceGalleryProps {
  items: GalleryItem[]
  onViewAll?: () => void
}

export function SpaceGallery({ items, onViewAll }: SpaceGalleryProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Galería Reciente</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.slice(0, 6).map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">por {item.author}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
