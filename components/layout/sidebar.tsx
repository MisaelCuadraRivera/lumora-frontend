"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateSpaceModal } from "@/components/spaces/create-space-modal";
import { useAuth } from "@/lib/auth";
import { useSpaces } from "@/hooks/useSpaces";
import { useFacets } from "@/hooks/useFacets";
import { useToast } from "@/hooks/use-toast";
import { getUnreadNotifications } from "@/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  User,
  Compass,
  Settings,
  Hash,
  Volume2,
  Plus,
  ChevronDown,
  MessageSquare,
  ShoppingCart,
  Calendar,
  Loader2,
  Check,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    name: "Mensajes",
    href: "/messages",
    icon: MessageSquare,
    badge: true,
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
    name: "Eventos",
    href: "/events",
    icon: Calendar,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { spaces } = useSpaces({ autoFetch: !!user });
  const { facets, toggleFacet } = useFacets({ autoFetch: !!user });
  const { toast } = useToast();
  const unreadCount = user ? getUnreadNotifications(user.id).length : 0;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [switchingFacetId, setSwitchingFacetId] = useState<string | null>(null);

  const handleSwitchFacet = async (e: React.MouseEvent, facetId: string) => {
    e.stopPropagation();
    if (switchingFacetId) return;

    setSwitchingFacetId(facetId);
    try {
      const result = await toggleFacet(facetId);
      if (result.success) {
        toast({
          title: "Faceta cambiada",
          description: "Tu faceta activa ha sido actualizada.",
        });
        await refreshUser();
      } else {
        throw new Error(result.message || "Error al cambiar de faceta");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo cambiar de faceta.",
        variant: "destructive",
      });
    } finally {
      setSwitchingFacetId(null);
    }
  };
  // For closing sidebar on mobile navigation
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  // Filtrar espacios a los que el usuario se ha unido (por ahora mostramos todos los espacios públicos)
  const joinedSpaces = spaces.filter(
    (space) => space.isJoined || space.isPublic
  );
  // Close sidebar on navigation (mobile only, only when pathname changes)
  const prevPath = useRef(pathname);
  useEffect(() => {
    if (!isMobile) return;
    if (prevPath.current !== pathname) {
      const evt = new CustomEvent("lumora-close-sidebar");
      window.dispatchEvent(evt);
      prevPath.current = pathname;
    }
  }, [isMobile, pathname]);

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border p-0 m-0">
      {/* User Section / Quick Facet Switcher */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent/35 p-1 rounded-lg transition-colors group">
              <Avatar className="h-10 w-10 border border-sidebar-border">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.facets?.find((f) => f.isActive)?.name ||
                    "Sin faceta activa"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={8}>
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground px-2 py-1.5">
              Cambiar Identidad (Faceta)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {facets && facets.length > 0 ? (
              facets.map((facet) => {
                const isFacetActive = facet.isActive;
                const isCurrentlySwitching = switchingFacetId === facet.id;
                
                return (
                  <DropdownMenuItem
                    key={facet.id}
                    onClick={(e) => {
                      if (!isFacetActive) {
                        handleSwitchFacet(e, facet.id);
                      }
                    }}
                    disabled={isCurrentlySwitching}
                    className={cn(
                      "cursor-pointer flex items-center justify-between gap-2 py-2 px-2 transition-colors",
                      isFacetActive && "bg-accent/40 font-medium text-primary pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={facet.avatar || user?.avatar} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {facet.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-xs">{facet.name}</span>
                    </div>
                    {isCurrentlySwitching ? (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : isFacetActive ? (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    ) : null}
                  </DropdownMenuItem>
                );
              })
            ) : (
              <div className="px-2 py-3 text-center text-xs text-muted-foreground">
                No tienes facetas creadas
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push("/profile/facets");
              }}
              className="cursor-pointer text-xs text-center justify-center font-medium text-primary hover:bg-primary/5"
            >
              Gestionar Facetas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 p-0 m-0">
        {/* Main Navigation */}
        <div className="p-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 px-1.5 text-xs"
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Spaces Section */}
        <div className="p-2 mt-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Espacios
            </h3>
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
                    pathname.startsWith(`/spaces/${space.id}`) &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={space.image || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {space.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{space.name}</span>
                  {space.activeMembers > 0 && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                  )}
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
                    pathname.includes("/chat") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">general</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto h-4 px-1 text-xs"
                  >
                    128
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80"
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">anuncios</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto h-4 px-1 text-xs"
                  >
                    4
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80"
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">discusión-hyperion</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto h-4 px-1 text-xs"
                  >
                    36
                  </Badge>
                </Button>
              </Link>
              <Link href="/spaces/cosmolectores/chat">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80"
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">spoilers-abiertos</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto h-4 px-1 text-xs"
                  >
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80"
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Sala de Lectura</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-8 px-2 text-sidebar-foreground/80"
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Debate Semanal</span>
              </Button>
            </nav>
          </div>
        )}
        {/* Create Space Button */}
        <div className="p-2 border-t border-sidebar-border mt-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Espacio
          </Button>
        </div>
      </ScrollArea>

      {/* Footer with Theme Toggle */}
      <div className="p-2 border-t border-sidebar-border bg-sidebar mt-0">
        <div className="space-y-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Create Space Modal */}
      <CreateSpaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
