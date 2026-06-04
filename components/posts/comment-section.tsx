"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { cn } from "@/lib/utils"
import { apiService } from "@/lib/api"
import { LikersModal } from "@/components/social/likers-modal"

interface CommentSectionProps {
  comments: any[]
  postId: string
  onComment?: (postId: string, content: string, parentId?: string) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  currentUserId?: string
}

interface CommentItemProps {
  comment: any
  postId: string
  level?: number
  onComment?: (postId: string, content: string, parentId?: string) => void
  onLike?: (commentId: string) => void
  onDelete?: (commentId: string) => void
  currentUserId?: string
}

function CommentItem({ 
  comment, 
  postId,
  level = 0, 
  onComment, 
  onLike, 
  onDelete, 
  currentUserId 
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(comment.likesCount || comment.likes || 0)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [showLikers, setShowLikers] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    onLike?.(comment.id)
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      if (onComment) {
        await onComment(postId, replyContent, comment.id)
        setReplyContent("")
        setIsReplying(false)
        setShowReplies(true)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la respuesta.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return

    try {
      onDelete?.(comment.id)
      toast({
        title: "Comentario eliminado",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario.",
        variant: "destructive",
      })
    }
  }

  const isOwner = currentUserId === comment.userId
  const hasReplies = comment.replies && comment.replies.length > 0

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex gap-3", level > 0 && "ml-4 md:ml-8 border-l-2 border-border/30 pl-4")}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.author?.avatar} />
          <AvatarFallback className="bg-primary/20 text-primary text-xs uppercase">
            {comment.author?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2 min-w-0">
          <div className="bg-muted/50 rounded-2xl px-3 py-2 hover:bg-muted/70 transition-colors">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xs text-foreground truncate">
                  {comment.author?.username || "Usuario"}
                </p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(new Date(comment.createdAt))}
                </p>
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
            <p className="text-sm text-foreground leading-relaxed break-words whitespace-pre-wrap">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 px-1">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-red-500",
                isLiked ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
              <span>{likesCount}</span>
            </button>
            
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Reply className="h-3 w-3" />
              <span>Responder</span>
            </button>

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {showReplies ? "Ocultar respuestas" : `Ver ${comment.replies.length} respuestas`}
              </button>
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
                className="space-y-2 mt-2"
              >
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Escribe una respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[60px] resize-none text-sm rounded-xl"
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                    className="h-8 rounded-full text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="h-8 rounded-full text-xs"
                  >
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Responder"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Render Replies */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <div className="space-y-3">
            {comment.replies.map((reply: any) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                level={level + 1}
                onComment={onComment}
                onLike={onLike}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <LikersModal 
        isOpen={showLikers} 
        onClose={() => setShowLikers(false)} 
        targetId={comment.id} 
        targetType="comment" 
      />
    </div>
  )
}

export function CommentSection({ 
  comments, 
  postId, 
  onComment, 
  onLike, 
  onDelete, 
  currentUserId 
}: CommentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Comentarios</h3>
        <span className="text-xs text-muted-foreground">{comments.length} hilos</span>
      </div>
      
      {comments.length === 0 ? (
        <div className="py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Aún no hay comentarios. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onComment={onComment}
              onLike={onLike}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
