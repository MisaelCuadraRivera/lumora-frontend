"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateSpaceModal } from "@/components/spaces/create-space-modal"
import { useAuth } from "@/lib/auth"
import { getJoinedSpaces, getUnreadNotifications } from "@/data"
import { Home, User, Compass, Bell, Settings, Hash, Volume2, Plus, ChevronDown, MessageSquare, ShoppingCart } from "lucide-react"

const navigationItems = [
  {
    name: "Inicio",
    href: "/feed",
    icon: Home,
  },
  {
    name: "Mi Perfil",
    href: "/profile",
    icon: User,
  },
  {
    name: "Explorar",
    href: "/explore",
    icon: Compass,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: ShoppingCart,
  },
  {
    name: "Mensajes",
    href: "/messages",
    icon: MessageSquare,
    badge: true,
  },
  {
    name: "Notificaciones",
    href: "/notifications",
    icon: Bell,
    badge: true,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const joinedSpaces = getJoinedSpaces()
  const unreadCount = user ? getUnreadNotifications(user.id).length : 0
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* User Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.username}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.facets.find((f) => f.isActive)?.name || "Sin faceta activa"}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Main Navigation */}
        <div className="p-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Spaces Section */}
        <div className="p-2 mt-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Espacios</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-1">
            {joinedSpaces.map((space) => (
              <Link key={space.id} href={`/spaces/${space.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-8 px-2",
                    pathname.startsWith(`/spaces/${space.id}`) && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={space.image || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {space.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{space.name}</span>
                  {space.activeMembers > 0 && <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Channels Section (when in a space) */}
        {pathname.startsWith("/spaces/") && (
          <div className="p-2 mt-4">
            <div className="mb-2 px-2">
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Canales de texto
              </h3>
            </div>
            <nav className="space-y-1">
              <Link href="/spaces/cosmolectores/chat">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80",
                    pathname.includes("/chat") && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">general</span>
                  <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                    128
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80">
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">anuncios</span>
                  <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                    4
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80">
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">discusión-hyperion</span>
                  <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                    36
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80">
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">spoilers-abiertos</span>
                  <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                    12
                  </Badge>
                </Button>
              </Link>
            </nav>

            <div className="mb-2 px-2 mt-4">
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                Canales de voz
              </h3>
            </div>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Sala de Lectura</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Debate Semanal</span>
              </Button>
            </nav>
          </div>
        )}
        {/* Create Space Button */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Espacio
          </Button>
        </div>
      </ScrollArea>

      {/* Create Space Modal */}
      <CreateSpaceModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  )
}
