"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { mockUsers, mockSpaces, mockPosts, mockProducts, mockEvents } from "@/data"

export default function SearchPage() {
  const params = useSearchParams()
  const router = useRouter()
  const initialQ = params.get("q") || ""
  const [query, setQuery] = useState(initialQ)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [withImages, setWithImages] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return {
        users: [],
        spaces: [],
        posts: [],
        products: [],
        events: [],
      }
    }

    const users = mockUsers.filter(u => 
      u.username.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q)
    )
    const spaces = mockSpaces.filter(s => 
      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
    const posts = mockPosts.filter(p => 
      p.content.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    )
    const products = mockProducts.filter(p => 
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
    const events = mockEvents.filter(e => 
      e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    )

    return { users, spaces, posts, products, events }
  }, [query])

  const total = filtered.users.length + filtered.spaces.length + filtered.posts.length + filtered.products.length + filtered.events.length

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.replace(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="p-6 space-y-4">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en Lumora..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <div className="text-sm text-muted-foreground">
        {query ? (
          <span>
            {total} resultados para "{query}"
          </span>
        ) : (
          <span>Escribe para comenzar a buscar</span>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todo</TabsTrigger>
          <TabsTrigger value="users">Usuarios ({filtered.users.length})</TabsTrigger>
          <TabsTrigger value="spaces">Espacios ({filtered.spaces.length})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({filtered.posts.length})</TabsTrigger>
          <TabsTrigger value="market">Marketplace ({filtered.products.length})</TabsTrigger>
          <TabsTrigger value="events">Eventos ({filtered.events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <SectionUsers users={filtered.users.slice(0, 5)} />
          <SectionSpaces spaces={filtered.spaces.slice(0, 5)} />
          <SectionPosts posts={filtered.posts.slice(0, 5)} />
          <SectionProducts products={filtered.products.slice(0, 5)} />
          <SectionEvents events={filtered.events.slice(0, 5)} />
        </TabsContent>

        <TabsContent value="users">
          <SectionUsers users={filtered.users} />
        </TabsContent>
        <TabsContent value="spaces">
          <SectionSpaces spaces={filtered.spaces} />
        </TabsContent>
        <TabsContent value="posts">
          <SectionPosts posts={filtered.posts} />
        </TabsContent>
        <TabsContent value="market">
          <SectionProducts products={filtered.products} />
        </TabsContent>
        <TabsContent value="events">
          <SectionEvents events={filtered.events} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SectionUsers({ users }: { users: any[] }) {
  if (!users.length) return <Empty label="No hay usuarios" />
  return (
    <div className="grid gap-3">
      {users.map((u) => (
        <Card key={u.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{u.username}</div>
                <div className="text-xs text-muted-foreground truncate">{u.bio}</div>
              </div>
              <Badge variant="secondary">{u.facets?.[0]?.name || "Usuario"}</Badge>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function SectionSpaces({ spaces }: { spaces: any[] }) {
  if (!spaces.length) return <Empty label="No hay espacios" />
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {spaces.map((s) => (
        <Card key={s.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="py-3">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.description}</div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Badge variant="secondary">{s.memberCount} miembros</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SectionPosts({ posts }: { posts: any[] }) {
  if (!posts.length) return <Empty label="No hay posts" />
  return (
    <div className="grid gap-3">
      {posts.map((p) => (
        <Card key={p.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="py-3">
            <div className="font-medium line-clamp-2">{p.content}</div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="text-xs text-muted-foreground">por {p.author?.username}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SectionProducts({ products }: { products: any[] }) {
  if (!products.length) return <Empty label="No hay productos" />
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Card key={p.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="py-3">
            <div className="font-medium truncate">{p.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Badge variant="secondary">${p.price} {p.currency}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SectionEvents({ events }: { events: any[] }) {
  if (!events.length) return <Empty label="No hay eventos" />
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <Card key={e.id} className="hover:bg-accent/30 transition-colors">
          <CardHeader className="py-3">
            <div className="font-medium truncate">{e.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{e.description}</div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Badge variant="secondary">{e.category?.name || "General"}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-10 text-muted-foreground text-sm">
      {label}
    </div>
  )
}
