"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatTimeAgo } from "@/data"
import type { Post } from "@/types"

import { useState, useEffect } from "react"

interface PostContentProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onReport?: (postId: string) => void
}

export function PostContent({ post, onLike, onComment, onShare, onReport }: PostContentProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes ?? 0)

  useEffect(() => {
    setIsLiked(post.isLiked || false)
    setLikesCount(post.likesCount ?? post.likes ?? 0)
  }, [post.isLiked, post.likes, post.likesCount])

  const handleLike = () => {
    const newLikedState = !isLiked
    const newCount = newLikedState ? likesCount + 1 : Math.max(0, likesCount - 1)
    
    setIsLiked(newLikedState)
    setLikesCount(newCount)
    onLike?.(post.id)
  }

  const handleComment = () => {
    onComment?.(post.id)
  }

  const handleShare = () => {
    onShare?.(post.id)
  }

  const handleReport = () => {
    onReport?.(post.id)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author?.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {post.author?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{post.author?.username || "Usuario"}</h3>
              {post.facet && (
                <Badge variant="secondary" className="text-xs">
                  {post.facet.name}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleReport} className="text-red-600">
                Reportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <div 
            className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-2">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="rounded-lg max-w-full h-auto"
                />
              ))}
            </div>
          )}

          {/* Links */}
          {post.links && post.links.length > 0 && (
            <div className="mt-4 space-y-2">
              {post.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="text-sm text-blue-500 underline">{link}</div>
                </a>
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn("gap-2 hover:text-red-500", isLiked && "text-red-500")}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-sm">{likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.commentsCount || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">{post.shares}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
