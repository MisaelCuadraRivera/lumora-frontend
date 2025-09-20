"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { ImageIcon, LinkIcon, Smile, MapPin, Calendar, Send, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PostComposerProps {
  onPost?: (content: string, facetId?: string, spaceId?: string, tags?: string[]) => void
  spaceId?: string
  placeholder?: string
}

export function PostComposer({ onPost, spaceId, placeholder = "¿Qué estás pensando?" }: PostComposerProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [selectedFacet, setSelectedFacet] = useState(user?.facets.find((f) => f.isActive)?.id || "")
  const [tags, setTags] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [privacy, setPrivacy] = useState(spaceId ? "space" : "public")

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    if (!content.trim()) {
      setIsExpanded(false)
      setTags("")
    }
  }

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
    setIsExpanded(false)
  }

  const activeFacet = user?.facets.find((f) => f.id === selectedFacet)

  return (
    <Card className="border-border/50 bg-background/95 backdrop-blur-sm hover:bg-background/80 transition-all duration-200">
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Compact View (Facebook/Twitter style)
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleExpand}
            >
              <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 bg-muted/30 hover:bg-muted/50 rounded-full px-4 py-3 transition-colors cursor-pointer">
                <p className="text-sm text-muted-foreground">
                  {placeholder}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 rounded-full h-9 w-9 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 rounded-full h-9 w-9 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            // Expanded View
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
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
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCollapse}
                  className="hover:bg-muted rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Text Area */}
              <div className="space-y-3">
                <Textarea
                  placeholder={placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
                  maxLength={500}
                  autoFocus
                />
                
                {content.length > 0 && (
                  <div className="flex justify-end">
                    <span className={cn(
                      "text-xs",
                      content.length > 450 ? "text-destructive" : 
                      content.length > 400 ? "text-yellow-600" : "text-muted-foreground"
                    )}>
                      {content.length}/500
                    </span>
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <Input
                placeholder="Agregar tags (separados por comas)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-sm border-border/50 bg-muted/30 focus:bg-background transition-colors"
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                    <ImageIcon className="h-4 w-4" />
                    Imagen
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                    <LinkIcon className="h-4 w-4" />
                    Enlace
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                    <Smile className="h-4 w-4" />
                    Emoji
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="w-auto h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">🌍 Público</SelectItem>
                      <SelectItem value="friends">👥 Amigos</SelectItem>
                      <SelectItem value="private">🔒 Solo yo</SelectItem>
                      {spaceId && <SelectItem value="space">🏛️ Espacio</SelectItem>}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handlePost} 
                    disabled={!content.trim() || isPosting || content.length > 500} 
                    size="sm"
                    className="gap-2"
                  >
                    <Send className="h-3 w-3" />
                    {isPosting ? "Publicando..." : "Publicar"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
