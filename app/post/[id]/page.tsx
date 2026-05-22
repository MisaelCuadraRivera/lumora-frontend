"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { normalizePost, normalizeComment } from "@/hooks/usePosts"
import { useAuth } from "@/lib/auth"

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await apiService.getPost(postId)
        if (response.success) {
          setPost(normalizePost(response.data, currentUser))
        } else {
          setError(response.message || "No se pudo cargar el post")
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar el post")
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, currentUser])

  const handleLike = async (id: string) => {
    try {
      const response = await apiService.toggleLike(id)
      if (response.success && response.data) {
        // Sincronizar estado con la respuesta del backend
        const updatedData = normalizePost(response.data, currentUser)
        setPost((prev: any) => ({
          ...prev,
          likes: updatedData.likes,
          likesCount: updatedData.likes,
          isLiked: updatedData.isLiked
        }))
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo procesar el like",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (id: string, content: string, parentId?: string) => {
    try {
      const response = await apiService.addComment(id, content, parentId)
      if (response.success) {
        const newComment = normalizeComment(response.data)
        
        setPost((prev: any) => {
          if (!prev) return prev;
          
          if (!parentId) {
            return {
              ...prev,
              comments: [newComment, ...(prev.comments || [])],
              commentsCount: (prev.commentsCount || 0) + 1
            }
          }

          const insertReply = (comments: any[]): any[] => {
            return comments.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: [newComment, ...(comment.replies || [])]
                }
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: insertReply(comment.replies)
                }
              }
              return comment
            })
          }

          const newComments = insertReply(prev.comments || [])
          const newCommentsCount = (prev.commentsCount || 0) + 1

          return {
            ...prev,
            comments: newComments,
            commentsCount: newCommentsCount
          }
        })

        toast({
          title: "Comentario publicado",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo enviar el comentario",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">
            {error || "Post no encontrado"}
          </h1>
          <p className="text-muted-foreground mb-4">
            El post que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/feed">
            <Button>Volver al Feed</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/feed">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Feed
          </Button>
        </Link>
      </div>

      <PostCard
        post={post}
        showComments={true}
        onLike={handleLike}
        onComment={handleComment}
        onShare={(postId) => console.log("Shared post:", postId)}
      />
    </div>
  )
}
