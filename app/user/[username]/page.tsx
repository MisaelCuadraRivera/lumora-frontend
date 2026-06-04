"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { ProfileHeader } from "@/components/profile/profile-header"
import { FacetCard } from "@/components/profile/facet-card"
import { apiService } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
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
  BarChart3,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  const [profileUser, setProfileUser] = useState<any>(null)
  const [profilePosts, setProfilePosts] = useState<any[]>([])
  const [profileSpaces, setProfileSpaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  // Fetch profile dynamically
  useEffect(() => {
    let active = true;
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userResponse = await apiService.getUserByUsername(username);
        if (!active) return;
        
        if (userResponse.success && userResponse.data) {
          const uData = userResponse.data;
          setProfileUser(uData);
          
          if (currentUser && uData.followers) {
            setIsFollowing(uData.followers.includes(currentUser.id));
          }

          // Fetch user posts
          const postsResponse = await apiService.getUserPosts(uData.id);
          if (active && postsResponse.success) {
            const pData = postsResponse.data?.posts || postsResponse.data || [];
            setProfilePosts(Array.isArray(pData) ? pData : []);
          }

          // Fetch spaces
          try {
            const spacesResponse = await apiService.getSpaces();
            if (active && spacesResponse.success) {
              const sData = spacesResponse.data?.spaces || spacesResponse.data || [];
              if (Array.isArray(sData)) {
                setProfileSpaces(sData.filter((space: any) => space.userId === uData.id || space.isJoined));
              }
            }
          } catch (e) {
            console.error('Error fetching profile spaces:', e);
          }

        } else {
          setError(userResponse.message || "Usuario no encontrado");
        }
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Error al cargar el perfil");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
    return () => {
      active = false;
    };
  }, [username, currentUser]);

  // Check if this is the current user's profile
  const isOwner = !!(currentUser && profileUser && currentUser.id === profileUser.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Usuario no encontrado</h1>
          <p className="text-muted-foreground mb-4">{error || "El usuario que buscas no existe."}</p>
          <Link href="/feed">
            <Button>Volver al Feed</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get user's posts
  const userPosts = profilePosts
  
  // Get user's joined spaces
  const userSpaces = profileSpaces

  // Get public facets
  const publicFacets = (profileUser.facets || []).filter(
    (facet: any) => facet.privacy === "public" || facet.isPublic === true
  )

  const handleFollow = async () => {
    try {
      const response = await apiService.toggleFollow(user.id)
      if (response.success) {
        setIsFollowing(!isFollowing)
        toast({
          title: !isFollowing ? "Siguiendo" : "Dejaste de seguir",
          description: !isFollowing 
            ? `Ahora sigues a ${user.username}` 
            : `Ya no sigues a ${user.username}`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado de seguimiento.",
        variant: "destructive"
      })
    }
  }

  const handleMessage = () => {
    router.push(`/messages?user=${user.username}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.username} en Lumora`,
        url: `/user/${user.username}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/user/${user.username}`)
      toast({
        title: "Enlace copiado",
        description: "El enlace del perfil se copió al portapapeles",
      })
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await apiService.toggleLike(postId)
      toast({
        title: "Reacción guardada",
        description: "Tu interacción ha sido registrada.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar el me gusta.",
        variant: "destructive"
      })
    }
  }

  const handleComment = async (postId: string, content: string) => {
    try {
      await apiService.addComment(postId, content)
      toast({
        title: "Comentario publicado",
        description: "Tu comentario ha sido publicado exitosamente.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo publicar el comentario.",
        variant: "destructive"
      })
    }
  }

  const handleSharePost = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
    toast({
      title: "Enlace de publicación copiado",
      description: "El enlace se copió al portapapeles",
    })
  }

  const handleJoinSpace = async (spaceId: string) => {
    try {
      const response = await apiService.joinSpace(spaceId)
      if (response.success) {
        toast({
          title: "Te has unido",
          description: "Te has unido al espacio exitosamente.",
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo unir al espacio.",
        variant: "destructive"
      })
    }
  }

  const handleLeaveSpace = async (spaceId: string) => {
    try {
      const response = await apiService.leaveSpace(spaceId)
      if (response.success) {
        toast({
          title: "Has salido",
          description: "Has salido del espacio exitosamente.",
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo salir del espacio.",
        variant: "destructive"
      })
    }
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
          <h1 className="text-xl font-bold text-foreground">
            Perfil de {profileUser.username}
          </h1>
        </div>
      </div>
 
      {/* Profile Header */}
      <ProfileHeader 
        user={profileUser} 
        isOwner={isOwner} 
        onEdit={() => router.push('/settings')} 
        onFollowChange={(userId, isFollowingState) => setIsFollowing(isFollowingState)}
      />
 
      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex md:grid md:grid-cols-4 overflow-x-auto whitespace-nowrap scrollbar-none justify-start md:justify-center p-1">
          <TabsTrigger value="posts" className="gap-2 flex-shrink-0">
            <FileText className="h-4 w-4" />
            Posts ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="spaces" className="gap-2 flex-shrink-0">
            <Hash className="h-4 w-4" />
            Espacios ({userSpaces.length})
          </TabsTrigger>
          <TabsTrigger value="facets" className="gap-2 flex-shrink-0">
            <Palette className="h-4 w-4" />
            Facetas ({publicFacets.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 flex-shrink-0">
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
                  limitComments={true}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay posts aún</h3>
                <p className="text-muted-foreground">
                  {profileUser.username} aún no ha publicado nada
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
                  {profileUser.username} no se ha unido a ningún espacio aún
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facets" className="space-y-6">
          {publicFacets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicFacets.map((facet) => (
                <FacetCard
                  key={facet.id}
                  facet={facet}
                  isOwner={false}
                  onView={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay facetas públicas</h3>
                <p className="text-muted-foreground">
                  {profileUser.username} no ha configurado ninguna faceta como pública
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ProfileAnalytics user={profileUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
