"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/posts/post-card"
import { SpaceCard } from "@/components/spaces/space-card"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { SearchSkeleton, UserSkeleton, SpaceSkeleton, PostSkeleton } from "@/components/ui/skeleton-loaders"
import { mockUsers, mockSpaces, mockPosts } from "@/data"
import { Search, Users, Hash, FileText, Filter, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [activeTab, setActiveTab] = useState("all")
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  // Search results
  const searchResults = {
    users: mockUsers.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    spaces: mockSpaces.filter(space => 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    posts: mockPosts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Infinite scroll for each tab
  const usersInfinite = useInfiniteScroll(searchResults.users, 6, {
    enabled: activeTab === "users" || activeTab === "all",
  })

  const spacesInfinite = useInfiniteScroll(searchResults.spaces, 6, {
    enabled: activeTab === "spaces" || activeTab === "all",
  })

  const postsInfinite = useInfiniteScroll(searchResults.posts, 5, {
    enabled: activeTab === "posts" || activeTab === "all",
  })

  const totalResults = searchResults.users.length + searchResults.spaces.length + searchResults.posts.length

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsInitialLoading(true)
      
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const url = new URL(window.location.href)
      url.searchParams.set("q", searchQuery)
      window.history.pushState({}, "", url.toString())
      setIsInitialLoading(false)
    }
  }

  const handleJoinSpace = (spaceId: string) => {
    console.log("Joining space:", spaceId)
  }

  const handleLeaveSpace = (spaceId: string) => {
    console.log("Leaving space:", spaceId)
  }

  const handleLike = (postId: string) => {
    console.log("Liked post:", postId)
  }

  const handleComment = (postId: string, content: string) => {
    console.log("Comment on post:", postId, content)
  }

  const handleShare = (postId: string) => {
    console.log("Shared post:", postId)
  }

  if (isInitialLoading) {
    return <SearchSkeleton />
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
            Búsqueda
          </h1>
          <p className="text-muted-foreground mt-1">
            {query ? `Resultados para "${query}"` : "Busca usuarios, espacios y contenido"}
          </p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios, espacios, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {query && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      )}

      {/* Results Tabs */}
      {query && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              <Search className="h-4 w-4" />
              Todo ({totalResults})
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuarios ({searchResults.users.length})
            </TabsTrigger>
            <TabsTrigger value="spaces" className="gap-2">
              <Hash className="h-4 w-4" />
              Espacios ({searchResults.spaces.length})
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="h-4 w-4" />
              Posts ({searchResults.posts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Users Section */}
            {searchResults.users.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuarios ({searchResults.users.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {usersInfinite.displayedItems.map((user) => (
                    <Card key={user.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{user.username}</h3>
                            <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {user.facets.slice(0, 2).map((facet) => (
                                <Badge key={facet.id} variant="secondary" className="text-xs">
                                  {facet.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Ver Perfil
                          </Button>
                          <Button size="sm" className="flex-1">
                            Seguir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Users Infinite Scroll */}
                {usersInfinite.hasMore && (
                  <div ref={usersInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más usuarios...</span>
                    </div>
                  </div>
                )}
                
                {usersInfinite.isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <UserSkeleton key={`loading-users-${index}`} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Spaces Section */}
            {searchResults.spaces.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Espacios ({searchResults.spaces.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spacesInfinite.displayedItems.map((space) => (
                    <SpaceCard 
                      key={space.id} 
                      space={space} 
                      onJoin={handleJoinSpace} 
                      onLeave={handleLeaveSpace} 
                    />
                  ))}
                </div>
                
                {/* Spaces Infinite Scroll */}
                {spacesInfinite.hasMore && (
                  <div ref={spacesInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más espacios...</span>
                    </div>
                  </div>
                )}
                
                {spacesInfinite.isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <SpaceSkeleton key={`loading-spaces-${index}`} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Posts Section */}
            {searchResults.posts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts ({searchResults.posts.length})
                </h2>
                <div className="space-y-6">
                  {postsInfinite.displayedItems.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))}
                </div>
                
                {/* Posts Infinite Scroll */}
                {postsInfinite.hasMore && (
                  <div ref={postsInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más posts...</span>
                    </div>
                  </div>
                )}
                
                {postsInfinite.isLoading && (
                  <div className="space-y-6">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <PostSkeleton key={`loading-posts-${index}`} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {searchResults.users.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {usersInfinite.displayedItems.map((user) => (
                    <Card key={user.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{user.username}</h3>
                            <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {user.facets.slice(0, 2).map((facet) => (
                                <Badge key={facet.id} variant="secondary" className="text-xs">
                                  {facet.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Ver Perfil
                          </Button>
                          <Button size="sm" className="flex-1">
                            Seguir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Users Infinite Scroll */}
                {usersInfinite.hasMore && (
                  <div ref={usersInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más usuarios...</span>
                    </div>
                  </div>
                )}
                
                {usersInfinite.isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <UserSkeleton key={`loading-users-${index}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="spaces" className="space-y-6">
            {searchResults.spaces.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spacesInfinite.displayedItems.map((space) => (
                    <SpaceCard 
                      key={space.id} 
                      space={space} 
                      onJoin={handleJoinSpace} 
                      onLeave={handleLeaveSpace} 
                    />
                  ))}
                </div>
                
                {/* Spaces Infinite Scroll */}
                {spacesInfinite.hasMore && (
                  <div ref={spacesInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más espacios...</span>
                    </div>
                  </div>
                )}
                
                {spacesInfinite.isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <SpaceSkeleton key={`loading-spaces-${index}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron espacios</h3>
                <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            {searchResults.posts.length > 0 ? (
              <>
                <div className="space-y-6">
                  {postsInfinite.displayedItems.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  ))}
                </div>
                
                {/* Posts Infinite Scroll */}
                {postsInfinite.hasMore && (
                  <div ref={postsInfinite.loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando más posts...</span>
                    </div>
                  </div>
                )}
                
                {postsInfinite.isLoading && (
                  <div className="space-y-6">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <PostSkeleton key={`loading-posts-${index}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron posts</h3>
                <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!query && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Busca en Lumora</h3>
            <p className="text-muted-foreground">
              Encuentra usuarios, espacios y contenido que te interese
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
