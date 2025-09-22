"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { formatTimeAgo } from "@/data"
import type { Post } from "@/types"
import { Heart, MessageCircle, Share, MoreHorizontal, Send, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TwitterPostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, content: string) => void
  onShare?: (postId: string) => void
  showComments?: boolean
}

export function TwitterPostCard({ post, onLike, onComment, onShare, showComments = true }: TwitterPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showAllComments, setShowAllComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)

  const handleLike = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1)
    onLike?.(post.id)
  }

  const handleComment = () => {
    if (newComment.trim() && onComment) {
      onComment(post.id, newComment.trim())
      setNewComment("")
      setIsCommenting(false)
    }
  }

  const handleShare = () => {
    onShare?.(post.id)
  }

  const visibleComments = showAllComments ? post.comments : post.comments.slice(0, 2)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-200 cursor-pointer group"
    >
      <div className="px-4 py-3">
        {/* Post Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-border/50 transition-all">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-muted text-foreground">
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold text-sm text-foreground hover:underline cursor-pointer">
                {post.author.username}
              </p>
              <span className="text-xs text-muted-foreground">·</span>
              <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
              
              {post.facet && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                    {post.facet.name}
                  </Badge>
                </>
              )}
              
              {post.spaceId && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                    Cosmolectores
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="ml-13">
          {/* Text Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground mb-3">
            {post.content}
          </p>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={cn(
              "grid gap-2 rounded-2xl overflow-hidden mb-3 border border-border/50",
              post.images.length === 1 && "grid-cols-1",
              post.images.length === 2 && "grid-cols-2",
              post.images.length > 2 && "grid-cols-2",
            )}>
              {post.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                    post.images!.length === 1 ? "aspect-video" : "aspect-square",
                    post.images!.length === 3 && index === 0 && "row-span-2",
                  )}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {post.images!.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold">+{post.images!.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {post.links && post.links.length > 0 && (
            <div className="space-y-2 mb-3">
              {post.links.map((link, index) => (
                <div key={index} className="border border-border/50 rounded-2xl bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-sm text-primary hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between max-w-md -ml-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 hover:text-red-500 hover:bg-red-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto",
                isLiked && "text-red-500 bg-red-500/5"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-sm tabular-nums">{likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:text-blue-500 hover:bg-blue-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto"
              onClick={() => setIsCommenting(!isCommenting)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm tabular-nums">{post.comments.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:text-green-500 hover:bg-green-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
              <span className="text-sm tabular-nums">{post.shares}</span>
            </Button>
          </div>
        </div>

        {/* Comment Input */}
        <AnimatePresence>
          {isCommenting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 ml-13"
            >
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-muted text-foreground text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none border-border/50 bg-transparent rounded-2xl"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsCommenting(false)
                        setNewComment("")
                      }}
                      className="rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleComment}
                      disabled={!newComment.trim()}
                      className="rounded-full"
                    >
                      <Send className="h-3 w-3 mr-2" />
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        {showComments && post.comments.length > 0 && (
          <div className="mt-4 ml-13 space-y-3">
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-muted text-foreground text-xs">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/50 rounded-2xl px-3 py-2 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{comment.author.username}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                  {comment.likes > 0 && (
                    <button className="text-xs text-muted-foreground hover:text-red-500 mt-1 ml-3 flex items-center gap-1">
                      <Heart className="h-3 w-3 fill-current" />
                      {comment.likes}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {post.comments.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm text-primary hover:text-primary/80 ml-10 rounded-full"
              >
                {showAllComments ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Mostrar menos comentarios
                  </>
                ) : (
                  <>
                    Ver {post.comments.length - 2} comentarios más
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
