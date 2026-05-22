"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { PostComposer } from "./post-composer"
import { getFeedPosts } from "@/data"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { FeedSkeleton, PostSkeleton } from "@/components/ui/skeleton-loaders"
import { Loader2 } from "lucide-react"
import type { Post } from "@/types"

interface PostFeedProps {
  spaceId?: string
  showCreatePost?: boolean
  posts?: Post[]
}

export function PostFeed({ spaceId, showCreatePost = true, posts: externalPosts }: PostFeedProps) {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Get posts from external source or default feed
  useEffect(() => {
    const loadPosts = async () => {
      setIsInitialLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const posts = externalPosts || getFeedPosts()
      setAllPosts(posts)
      setIsInitialLoading(false)
    }

    loadPosts()
  }, [externalPosts])

  const {
    displayedItems: posts,
    isLoading,
    hasMore,
    loadingRef,
  } = useInfiniteScroll(allPosts, 5, {
    enabled: !isInitialLoading,
  })

  const handleLike = (postId: string) => {
    setAllPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
    )
  }

  const handleComment = (postId: string, content: string) => {
    // In a real app, this would make an API call
    console.log(`Adding comment to post ${postId}: ${content}`)
  }

  const handleShare = (postId: string) => {
    setAllPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)),
    )
  }

  const handleCreatePost = (content: string, facetId?: string, spaceId?: string, tags?: string[]) => {
    // In a real app, this would make an API call
    console.log("Creating post:", { content, facetId, spaceId, tags })
  }

  const filteredPosts = spaceId ? posts.filter((post) => post.spaceId === spaceId) : posts

  if (isInitialLoading) {
    return <FeedSkeleton />
  }

  return (
    <div className="space-y-6">
      {showCreatePost && <PostComposer onPost={handleCreatePost} spaceId={spaceId} />}

      {filteredPosts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={handleLike} 
          onComment={handleComment} 
          onShare={handleShare} 
          limitComments={true}
        />
      ))}

      {/* Infinite Scroll Loading */}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Cargando más posts...</span>
          </div>
        </div>
      )}

      {/* Loading skeleton for new posts */}
      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <PostSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay publicaciones para mostrar</p>
        </div>
      )}
    </div>
  )
}
