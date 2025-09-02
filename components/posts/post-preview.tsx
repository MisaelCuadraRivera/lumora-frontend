"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Smartphone, Monitor } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { formatTimeAgo } from "@/data"

interface PostPreviewProps {
  content: string
  facetId?: string
  tags?: string[]
  onClose?: () => void
  onPublish?: () => void
}

export function PostPreview({ content, facetId, tags = [], onClose, onPublish }: PostPreviewProps) {
  const { user } = useAuth()
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(true)

  if (!user) return null

  const activeFacet = user.facets.find(f => f.id === facetId)
  const currentTime = new Date()

  const mockPost = {
    id: "preview",
    authorId: user.id,
    author: user,
    facetId,
    facet: activeFacet,
    content,
    tags,
    likes: 0,
    shares: 0,
    comments: [],
    createdAt: currentTime,
    updatedAt: currentTime,
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Previsualización del Post</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? "Ocultar" : "Mostrar"}
            </Button>
            <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "desktop" | "mobile")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="desktop" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="mobile" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Móvil
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showPreview && (
          <TabsContent value={previewMode} className="mt-0">
            <div className={`${previewMode === "mobile" ? "max-w-sm mx-auto" : ""}`}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{user.username}</h3>
                        {activeFacet && (
                          <Badge variant="secondary" className="text-xs">
                            {activeFacet.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(currentTime)}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <div 
                      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="text-sm">0 me gusta</span>
                      <span className="text-sm">0 comentarios</span>
                      <span className="text-sm">0 compartidos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onPublish} disabled={!content.trim()}>
            Publicar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
