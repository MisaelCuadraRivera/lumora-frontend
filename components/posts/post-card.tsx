"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeAgo } from "@/data";
import type { Post } from "@/types";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CommentSection } from "./comment-section";
import { LikersModal } from "@/components/social/likers-modal";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string, parentId?: string) => void;
  onShare?: (postId: string) => void;
  showComments?: boolean;
  limitComments?: boolean;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  showComments = true,
  limitComments = false,
}: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes ?? 0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showLikers, setShowLikers] = useState(false);

  // Sync state with props
  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikesCount(post.likesCount ?? post.likes ?? 0);
  }, [post.isLiked, post.likes, post.likesCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic UI update
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : Math.max(0, likesCount - 1);
    
    setIsLiked(newLikedState);
    setLikesCount(newLikesCount);
    
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newComment.trim() && onComment) {
      onComment(post.id, newComment.trim());
      setNewComment("");
      setIsCommenting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(post.id);
  };

  const navigateToDetail = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="border-b border-border/50 transition-colors duration-200 cursor-pointer group"
        onClick={navigateToDetail}
      >
        <div className="px-4 py-3">
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-border/50 transition-all">
              <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-muted text-foreground">
                {post.author?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold text-sm text-foreground hover:underline cursor-pointer">
                  {post.author?.username || "Usuario"}
                </p>
                <span className="text-xs text-muted-foreground">·</span>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(new Date(post.createdAt))}
                </p>
                {post.facet && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-0"
                    >
                      {post.facet.name}
                    </Badge>
                  </>
                )}

                {post.space && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge
                      variant="outline"
                      className="text-xs border-muted-foreground/30 text-muted-foreground"
                    >
                      {post.space.name}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
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

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div
                className={cn(
                  "grid gap-2 rounded-2xl overflow-hidden mb-3 border border-border/50",
                  post.media.length === 1 && "grid-cols-1",
                  post.media.length === 2 && "grid-cols-2",
                  post.media.length > 2 && "grid-cols-2",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {post.media.slice(0, 4).map((m, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                      post.media!.length === 1
                        ? "aspect-video"
                        : "aspect-square",
                    )}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/10">
                        <span className="text-xs">{m.type}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Search by tag logic
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between w-full -ml-2">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 hover:text-red-500 hover:bg-red-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto",
                      isLiked && "text-red-500 bg-red-500/5",
                    )}
                    onClick={handleLike}
                  >
                    <Heart
                      className={cn("h-4 w-4", isLiked && "fill-current")}
                    />
                  </Button>
                  <span
                    className="text-sm tabular-nums text-muted-foreground hover:underline cursor-pointer px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLikers(true);
                    }}
                  >
                    {likesCount}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:text-blue-500 hover:bg-blue-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCommenting(!isCommenting);
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm tabular-nums">
                    {post.commentsCount || 0}
                  </span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:text-green-500 hover:bg-green-500/10 transition-colors text-muted-foreground rounded-full px-3 py-1.5 h-auto"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                <span className="text-sm tabular-nums">
                  {post.shares || 0}
                </span>
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
                onClick={(e) => e.stopPropagation()}
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
                          setIsCommenting(false);
                          setNewComment("");
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
          {showComments && post.comments && post.comments.length > 0 && (
            <div
              className="mt-4 ml-13 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {limitComments && post.commentsCount && post.commentsCount > 1 && (
                <button
                  onClick={navigateToDetail}
                  className="text-xs text-muted-foreground hover:underline font-medium mb-2 block"
                >
                  Ver los {post.commentsCount} comentarios
                </button>
              )}
              
              <CommentSection
                comments={limitComments ? post.comments.slice(0, 1) : post.comments}
                postId={post.id}
                onComment={onComment}
                currentUserId={post.author?.id}
              />

              {limitComments && post.commentsCount && post.commentsCount > 1 && post.comments.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToDetail}
                  className="w-full text-xs text-muted-foreground hover:text-foreground mt-2"
                >
                  Ver más comentarios
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.article>

      <LikersModal
        isOpen={showLikers}
        onClose={() => setShowLikers(false)}
        targetId={post.id}
        targetType="post"
      />
    </>
  );
}
