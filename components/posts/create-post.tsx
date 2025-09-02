"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { ImageIcon, LinkIcon, HashIcon, Globe, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { PostPreview } from "@/components/posts/post-preview"

interface CreatePostProps {
  onPost?: (content: string, facetId?: string, spaceId?: string, tags?: string[]) => void
  spaceId?: string
}

export function CreatePost({ onPost, spaceId }: CreatePostProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [selectedFacet, setSelectedFacet] = useState(user?.facets.find((f) => f.isActive)?.id || "")
  const [tags, setTags] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [useRichEditor, setUseRichEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handlePost = async () => {
    if (!content.trim()) return

    setIsPosting(true)

    // Extract hashtags from content
    const hashtagRegex = /#(\w+)/g
    const contentTags = [...content.matchAll(hashtagRegex)].map((match) => match[1])
    const additionalTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    const allTags = [...new Set([...contentTags, ...additionalTags])]

    onPost?.(content, selectedFacet, spaceId, allTags)

    // Reset form
    setContent("")
    setTags("")
    setIsPosting(false)
  }

  const activeFacet = user?.facets.find((f) => f.id === selectedFacet)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{user?.username}</p>
              {activeFacet && (
                <Badge variant="secondary" className="text-xs">
                  {activeFacet.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Select value={selectedFacet} onValueChange={setSelectedFacet}>
                <SelectTrigger className="w-auto h-6 text-xs border-none p-0 focus:ring-0">
                  <SelectValue placeholder="Seleccionar faceta" />
                </SelectTrigger>
                <SelectContent>
                  {user?.facets.map((facet) => (
                    <SelectItem key={facet.id} value={facet.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {facet.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {spaceId ? (
                  <>
                    <Users className="h-3 w-3" />
                    <span>Cosmolectores</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3" />
                    <span>Público</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {useRichEditor ? (
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="¿Qué estás pensando?"
            maxLength={500}
            showToolbar={true}
          />
        ) : (
          <Textarea
            placeholder="¿Qué estás pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-base"
          />
        )}

        {showPreview && content.trim() && (
          <PostPreview
            content={content}
            facetId={selectedFacet}
            tags={tags.split(",").map(tag => tag.trim()).filter(Boolean)}
            onClose={() => setShowPreview(false)}
            onPublish={handlePost}
          />
        )}

        <div className="space-y-3">
          <Input
            placeholder="Agregar tags (separados por comas)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="text-sm"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseRichEditor(!useRichEditor)}
                className="gap-2"
              >
                {useRichEditor ? "Editor Simple" : "Editor Rico"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                Previsualizar
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">Imagen</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-sm">Enlace</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <HashIcon className="h-4 w-4" />
                <span className="text-sm">Tag</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{content.length}/500</span>
              <Button onClick={handlePost} disabled={!content.trim() || isPosting || content.length > 500} size="sm">
                {isPosting ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
