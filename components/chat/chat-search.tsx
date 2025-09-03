"use client"

import { useState, useEffect } from "react"
import { Search, X, MessageSquare, Hash, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { formatTimeAgo } from "@/data"
import { searchChatMessages } from "@/data"
import type { ChatSearchResult } from "@/types"

interface ChatSearchProps {
  channelId?: string
  onClose: () => void
  onMessageClick: (messageId: string) => void
}

export function ChatSearch({ channelId, onClose, onMessageClick }: ChatSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ChatSearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true)
      const searchResults = searchChatMessages(query, channelId)
      setResults(searchResults)
      setIsSearching(false)
    } else {
      setResults(null)
    }
  }, [query, channelId])

  const handleMessageClick = (messageId: string) => {
    onMessageClick(messageId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Buscar en el chat</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <Input
            placeholder="Buscar mensajes, canales, usuarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 p-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : results && query.trim().length > 0 ? (
            <div className="space-y-4">
              {/* Messages */}
              {results.messages.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensajes ({results.messages.length})
                  </h4>
                  <div className="space-y-2">
                    {results.messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleMessageClick(message.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <img src={message.author.avatar} alt={message.author.name} />
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.author.name}</span>
                              {message.author.role && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.author.role}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {message.content}
                            </p>
                            {message.attachment && (
                              <div className="flex items-center gap-1 mt-1">
                                <FileText className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {message.attachment.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Channels */}
              {results.channels.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Canales ({results.channels.length})
                  </h4>
                  <div className="space-y-2">
                    {results.channels.map((channel) => (
                      <div
                        key={channel.id}
                        className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">#{channel.name}</div>
                            {channel.description && (
                              <p className="text-xs text-muted-foreground">{channel.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {channel.memberCount || 0} miembros
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Usuarios ({results.users.length})
                  </h4>
                  <div className="space-y-2">
                    {results.users.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <img src={user.avatar} alt={user.username} />
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{user.username}</div>
                            {user.bio && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>
                            )}
                          </div>
                          {user.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.totalResults === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron resultados para "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Busca mensajes, canales o usuarios</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
