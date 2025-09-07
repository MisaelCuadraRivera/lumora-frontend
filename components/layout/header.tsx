'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/lib/auth'
import { mockUsers, mockSpaces, mockPosts } from '@/data'
import { Search, Settings, LogOut, User, Palette, Hash, Users, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LumoraLogo } from '@/components/ui/lumora-logo'
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Search results
  const searchResults = searchQuery.trim() ? {
    users: mockUsers.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    spaces: mockSpaces.filter(space => 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    posts: mockPosts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 3)
  } : null

  const hasResults = searchResults && (
    (searchResults.users?.length || 0) > 0 || 
    (searchResults.spaces?.length || 0) > 0 || 
    (searchResults.posts?.length || 0) > 0
  )

  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LumoraLogo width={32} height={32} className="drop-shadow-sm" />
          <h1 className="text-xl font-bold text-foreground">
            Lumora
          </h1>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="flex-1 max-w-md mx-8" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Input
                type="search"
                placeholder="Buscar usuarios, espacios, posts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (!isSearchOpen) setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                autoComplete="off"
                className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary/50"
              />
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Buscar en Lumora..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  {!searchQuery && (
                    <CommandEmpty>
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Escribe para buscar usuarios, espacios y posts
                      </div>
                    </CommandEmpty>
                  )}
                  
                  {searchQuery && !hasResults && (
                    <CommandEmpty>
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No se encontraron resultados para "{searchQuery}"
                      </div>
                    </CommandEmpty>
                  )}

                  {searchResults && searchResults.users && searchResults.users.length > 0 && (
                    <CommandGroup heading="Usuarios">
                      {searchResults.users.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            router.push(`/user/${user.username}`)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/80 transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {searchResults && searchResults.spaces && searchResults.spaces.length > 0 && (
                    <CommandGroup heading="Espacios">
                      {searchResults.spaces.map((space) => (
                        <CommandItem
                          key={space.id}
                          onSelect={() => {
                            router.push(`/spaces/${space.id}`)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/80 transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={space.image} />
                            <AvatarFallback>{space.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{space.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{space.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {space.memberCount} miembros
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {searchResults && searchResults.posts && searchResults.posts.length > 0 && (
                    <CommandGroup heading="Posts">
                      {searchResults.posts.map((post) => (
                        <CommandItem
                          key={post.id}
                          onSelect={() => {
                            router.push(`/post/${post.id}`)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/80 transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {post.content.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              por {post.author.username}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {hasResults && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                          setIsSearchOpen(false)
                        }}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/80 transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span>Ver todos los resultados para "{searchQuery}"</span>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </form>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationDropdown />

        {/* Settings */}
        <Button variant="ghost" size="sm" onClick={() => router.push('/settings')} className="cursor-pointer hover:bg-accent transition-colors">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || '/placeholder.svg'} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer hover:bg-accent/80 transition-colors"> 
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/profile/facets')} className="cursor-pointer hover:bg-accent/80 transition-colors"> 
              <Palette className="mr-2 h-4 w-4" />
              <span>Gestionar Facetas</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer hover:bg-accent/80 transition-colors"> 
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}