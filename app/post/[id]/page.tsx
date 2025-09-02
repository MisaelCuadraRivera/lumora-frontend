"use client"

import { useParams } from "next/navigation"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { getPostById } from "@/data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const post = getPostById(postId)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Post no encontrado</h1>
          <p className="text-muted-foreground mb-4">El post que buscas no existe o ha sido eliminado.</p>
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
        onLike={(postId) => console.log("Liked post:", postId)}
        onComment={(postId, content) => console.log("Comment on post:", postId, content)}
        onShare={(postId) => console.log("Shared post:", postId)}
      />
    </div>
  )
}
