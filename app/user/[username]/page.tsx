"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PostCard } from "@/components/posts/post-card"
import { SpaceCard } from "@/components/spaces/space-card"
import { SocialActions } from "@/components/social/social-actions"
import { ProfileStats } from "@/components/social/profile-stats"
import { ProfileAnalytics } from "@/components/social/profile-analytics"
import { getUserByUsername, mockUsers, mockSpaces, mockPosts } from "@/data"
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Heart, 
  MessageSquare, 
  Share2,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  Mail,
  Hash,
  FileText,
  Palette,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const user = getUserByUsername(username)
  const currentUser = mockUsers[0] // Simulate current user

  // Check if this is the current user's profile
  if (user?.id === currentUser?.id) {
    setIsOwner(true)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Usuario no encontrado</h1>
          <p className="text-muted-foreground mb-4">El usuario que buscas no existe.</p>
          <Link href="/feed">
            <Button>Volver al Feed</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get user's posts
  const userPosts = mockPosts.filter(post => post.authorId === user.id)
  
  // Get user's joined spaces
  const userSpaces = mockSpaces.filter(space => space.isJoined)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Implement follow/unfollow API call
  }

  const handleMessage = () => {
    // TODO: Navigate to messages
    console.log("Navigate to messages with:", user.username)
  }

  const handleShare = () => {
    // TODO: Implement share profile
    console.log("Share profile:", user.username)
  }

  const handleLike = (postId: string) => {
    console.log("Liked post:", postId)
  }

  const handleComment = (postId: string, content: string) => {
    console.log("Comment on post:", postId, content)
  }

  const handleSharePost = (postId: string) => {
    console.log("Shared post:", postId)
  }

  const handleJoinSpace = (spaceId: string) => {
    console.log("Joining space:", spaceId)
  }

  const handleLeaveSpace = (spaceId: string) => {
    console.log("Leaving space:", spaceId)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/feed">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {user.username}
          </h1>
        </div>
        {!isOwner && (
          <SocialActions 
            targetUser={user}
            onFollowChange={(userId, isFollowing) => setIsFollowing(isFollowing)}
          />
        )}
      </div>

      {/* Profile Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>

              {/* Stats */}
              <ProfileStats user={user} />

              {/* Active Facets */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Facetas activas:</span>
                {user.facets.filter(f => f.isActive).map((facet) => (
                  <Badge key={facet.id} variant="secondary" className="gap-1">
                    <Palette className="h-3 w-3" />
                    {facet.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            Posts ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="spaces" className="gap-2">
            <Hash className="h-4 w-4" />
            Espacios ({userSpaces.length})
          </TabsTrigger>
          <TabsTrigger value="facets" className="gap-2">
            <Palette className="h-4 w-4" />
            Facetas ({user.facets.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleSharePost}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay posts aún</h3>
                <p className="text-muted-foreground">
                  {user.username} aún no ha publicado nada
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="spaces" className="space-y-6">
          {userSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onJoin={handleJoinSpace}
                  onLeave={handleLeaveSpace}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay espacios</h3>
                <p className="text-muted-foreground">
                  {user.username} no se ha unido a ningún espacio aún
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.facets.map((facet) => (
              <Card key={facet.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={facet.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {facet.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{facet.name}</h3>
                      <p className="text-sm text-muted-foreground">{facet.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {facet.category}
                        </Badge>
                        {facet.isActive && (
                          <Badge variant="default" className="text-xs">
                            Activa
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ProfileAnalytics user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
