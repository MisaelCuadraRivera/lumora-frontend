"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { formatTimeAgo } from "@/data"
import type { Post } from "@/types"
import { Heart, MessageCircle, Share, MoreHorizontal, Send, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string, content: string) => void
  onShare?: (postId: string) => void
  showComments?: boolean
}

export function PostCard({ post, onLike, onComment, onShare, showComments = true }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showAllComments, setShowAllComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)

  const handleLike = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1)
    
    // Trigger animation
    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 600)
    
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout
    >
      <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {post.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{post.author.username}</p>
                  {post.facet && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <Badge variant="secondary" className="text-xs hover:scale-105 transition-transform bg-primary/20 text-primary border-primary/30">
                        {post.facet.name}
                      </Badge>
                    </motion.div>
                  )}
                  {post.spaceId && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Badge variant="outline" className="text-xs hover:scale-105 transition-transform border-border text-muted-foreground">
                        Cosmolectores
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Post Content */}
            <motion.p
              className="text-sm leading-relaxed whitespace-pre-wrap text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {post.content}
            </motion.p>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <motion.div
                className={cn(
                  "grid gap-2 rounded-lg overflow-hidden",
                  post.images.length === 1 && "grid-cols-1",
                  post.images.length === 2 && "grid-cols-2",
                  post.images.length > 2 && "grid-cols-2",
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {post.images.slice(0, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "relative bg-muted overflow-hidden rounded-md cursor-pointer",
                      post.images!.length === 1 ? "aspect-video" : "aspect-square",
                      post.images!.length === 3 && index === 0 && "row-span-2",
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {post.images!.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">+{post.images!.length - 4}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Links */}
            {post.links && post.links.length > 0 && (
              <div className="space-y-2">
                {post.links.map((link, index) => (
                  <Card key={index} className="border-border bg-muted/50">
                    <CardContent className="p-3">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {post.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer transition-colors border-border text-muted-foreground hover:text-primary hover:border-primary/50">
                      #{tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              className="flex items-center justify-between pt-2 border-t border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex items-center gap-1">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 relative overflow-hidden text-muted-foreground",
                      isLiked && "text-red-500 bg-red-500/10"
                    )}
                    onClick={handleLike}
                  >
                    {/* Like Animation Overlay */}
                    <AnimatePresence>
                      {likeAnimation && (
                        <motion.div
                          className="absolute inset-0 bg-red-500/20 rounded-md"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <motion.div 
                      animate={isLiked ? { 
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, 0]
                      } : {}} 
                      transition={{ 
                        duration: 0.6,
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6 }
                      }}
                    >
                      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    </motion.div>
                    
                    <motion.span 
                      className="text-xs"
                      animate={likeAnimation ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {likesCount}
                    </motion.span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:text-blue-500 hover:bg-blue-500/10 transition-colors duration-200 text-muted-foreground"
                    onClick={() => setIsCommenting(!isCommenting)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments.length}</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:text-green-500 hover:bg-green-500/10 transition-colors duration-200 text-muted-foreground"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4" />
                    <span className="text-xs">{post.shares}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && post.comments.length > 0 && (
                <motion.div
                  className="space-y-3 pt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Separator className="bg-slate-700/50" />
                  {visibleComments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {comment.author.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div className="flex-1 space-y-1">
                        <motion.div
                          className="bg-slate-800/50 rounded-lg px-3 py-2 hover:bg-slate-800/70 transition-colors border border-slate-700/30"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-xs text-white">{comment.author.username}</p>
                            <p className="text-xs text-slate-400">{formatTimeAgo(comment.createdAt)}</p>
                          </div>
                          <p className="text-sm text-slate-200">{comment.content}</p>
                        </motion.div>
                        {comment.likes > 0 && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:text-red-500 hover:bg-red-500/10 transition-colors text-slate-400"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {post.comments.length > 2 && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setShowAllComments(!showAllComments)}
                      >
                        {showAllComments ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Ocultar comentarios
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Ver {post.comments.length - 2} comentarios más
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comment Input */}
            <AnimatePresence>
              {isCommenting && (
                <motion.div
                  className="space-y-2 pt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Separator className="bg-slate-700/50" />
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[60px] resize-none focus:ring-2 focus:ring-primary/20 transition-all bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-500"
                      />
                      <div className="flex justify-end gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="sm" onClick={() => setIsCommenting(false)} className="text-slate-400 hover:text-slate-200">
                            Cancelar
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" onClick={handleComment} disabled={!newComment.trim()}>
                            <Send className="h-3 w-3 mr-1" />
                            Comentar
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
