"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { CommentSkeleton } from "@/components/ui/skeleton-loaders"
import { useToast } from "@/hooks/use-toast"
import { 
  Heart, 
  MessageCircle, 
  Reply, 
  MoreHorizontal, 
  Send, 
  Smile,
  Image as ImageIcon,
  Link as LinkIcon,
  AtSign,
  Loader2
} from "lucide-react"
import { formatTimeAgo } from "@/data"
import type { Comment } from "@/types"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  comments: Comment[]
  postId: string
  onComment?: (postId: string, content: string, parentId?: string) => void
  onLike?: (commentId: string) => void
  onReply?: (commentId: string, content: string) => void
  onDelete?: (commentId: string) => void
  currentUserId?: string
}

interface CommentItemProps {
  comment: Comment
  level?: number
  onReply?: (commentId: string, content: string) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  currentUserId?: string
}

function CommentItem({ 
  comment, 
  level = 0, 
  onReply, 
  onLike, 
  onDelete, 
  currentUserId 
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(comment.likes)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState(level === 0)
  const { toast } = useToast()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    onLike?.(comment.id)
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      onReply?.(comment.id, replyContent)
      setReplyContent("")
      setIsReplying(false)
      setShowReplies(true)
      toast({
        title: "Respuesta enviada",
        description: "Tu respuesta ha sido publicada.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return

    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      onDelete?.(comment.id)
      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario.",
        variant: "destructive",
      })
    }
  }

  const isOwner = currentUserId === comment.authorId
  const hasReplies = comment.replies && comment.replies.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-3", level > 0 && "ml-8 border-l-2 border-border/30 pl-4")}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {comment.author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="bg-muted/50 rounded-lg px-3 py-2 hover:bg-muted/70 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xs">{comment.author.username}</p>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                {comment.editedAt && (
                  <Badge variant="outline" className="text-xs">
                    editado
                  </Badge>
                )}
              </div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleDelete}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 hover:text-red-500 transition-colors",
                isLiked && "text-red-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-3 w-3 mr-1", isLiked && "fill-current")} />
              {likesCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 hover:text-blue-500 transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Responder
            </Button>

            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 hover:text-primary transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {showReplies ? "Ocultar" : "Ver"} {comment.replies!.length} respuesta{comment.replies!.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Escribe una respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AtSign className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {replyContent.length}/500
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplying(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                level={level + 1}
                onReply={onReply}
                onLike={onLike}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function CommentSection({ 
  comments, 
  postId, 
  onComment, 
  onLike, 
  onReply, 
  onDelete, 
  currentUserId 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const { toast } = useToast()

  const {
    displayedItems: displayedComments,
    isLoading,
    hasMore,
    loadingRef,
  } = useInfiniteScroll(comments, 10)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      onComment?.(postId, newComment)
      setNewComment("")
      setShowCommentInput(false)
      toast({
        title: "Comentario enviado",
        description: "Tu comentario ha sido publicado.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <AnimatePresence>
        {showCommentInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <Separator />
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
                  className="min-h-[80px] resize-none text-sm"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AtSign className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {newComment.length}/500
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentInput(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onLike={onLike}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))}

        {/* Infinite Scroll Loading */}
        {hasMore && (
          <div ref={loadingRef} className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando más comentarios...</span>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <CommentSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>

      {/* Show Comment Input Button */}
      {!showCommentInput && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          onClick={() => setShowCommentInput(true)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Agregar comentario
        </Button>
      )}
    </div>
  )
}
