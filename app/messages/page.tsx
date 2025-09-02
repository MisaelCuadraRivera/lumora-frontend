"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { MessageSkeleton } from "@/components/ui/skeleton-loaders"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Send, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  AtSign,
  Loader2,
  ArrowLeft,
  UserPlus,
  Settings,
  Trash2,
  Archive,
  Volume2,
  VolumeX
} from "lucide-react"
import { formatTimeAgo, formatTime } from "@/data"
import { mockUsers } from "@/data"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  type: "text" | "image" | "file"
  attachment?: {
    url: string
    name: string
    size: number
  }
}

interface Conversation {
  id: string
  userId: string
  user: {
    id: string
    username: string
    avatar: string
    isOnline: boolean
  }
  lastMessage: Message
  unreadCount: number
  isActive: boolean
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    userId: "2",
    user: {
      id: "2",
      username: "nyla_escritora",
      avatar: "/writer-profile.png",
      isOnline: true,
    },
    lastMessage: {
      id: "1",
      senderId: "2",
      receiverId: "1",
      content: "¡Hola! ¿Cómo va tu nuevo proyecto de arte?",
      timestamp: new Date("2024-03-15T19:30:00"),
      isRead: false,
      type: "text",
    },
    unreadCount: 2,
    isActive: false,
  },
  {
    id: "2",
    userId: "3",
    user: {
      id: "3",
      username: "sofia_curadora",
      avatar: "/curator-profile.png",
      isOnline: true,
    },
    lastMessage: {
      id: "2",
      senderId: "1",
      receiverId: "3",
      content: "Perfecto, nos vemos mañana en la galería",
      timestamp: new Date("2024-03-15T18:45:00"),
      isRead: true,
      type: "text",
    },
    unreadCount: 0,
    isActive: false,
  },
  {
    id: "3",
    userId: "4",
    user: {
      id: "4",
      username: "ilan_dev",
      avatar: "/developer-profile.png",
      isOnline: false,
    },
    lastMessage: {
      id: "3",
      senderId: "4",
      receiverId: "1",
      content: "El código está listo para revisión",
      timestamp: new Date("2024-03-15T17:20:00"),
      isRead: true,
      type: "text",
    },
    unreadCount: 0,
    isActive: false,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "2",
      receiverId: "1",
      content: "¡Hola! ¿Cómo va tu nuevo proyecto de arte?",
      timestamp: new Date("2024-03-15T19:30:00"),
      isRead: true,
      type: "text",
    },
    {
      id: "2",
      senderId: "1",
      receiverId: "2",
      content: "¡Hola Nyla! Está yendo muy bien, estoy experimentando con nuevas técnicas de generación de texturas.",
      timestamp: new Date("2024-03-15T19:32:00"),
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      senderId: "2",
      receiverId: "1",
      content: "¡Qué emocionante! ¿Podrías mostrarme algunos ejemplos?",
      timestamp: new Date("2024-03-15T19:35:00"),
      isRead: false,
      type: "text",
    },
    {
      id: "4",
      senderId: "2",
      receiverId: "1",
      content: "Me encantaría colaborar en algo juntos",
      timestamp: new Date("2024-03-15T19:36:00"),
      isRead: false,
      type: "text",
    },
  ],
  "2": [
    {
      id: "5",
      senderId: "3",
      receiverId: "1",
      content: "Hola Alex, ¿estás libre mañana para revisar las piezas de la exposición?",
      timestamp: new Date("2024-03-15T18:30:00"),
      isRead: true,
      type: "text",
    },
    {
      id: "6",
      senderId: "1",
      receiverId: "3",
      content: "¡Por supuesto! ¿A qué hora te parece bien?",
      timestamp: new Date("2024-03-15T18:35:00"),
      isRead: true,
      type: "text",
    },
    {
      id: "7",
      senderId: "3",
      receiverId: "1",
      content: "Perfecto, nos vemos mañana en la galería",
      timestamp: new Date("2024-03-15T18:45:00"),
      isRead: true,
      type: "text",
    },
  ],
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const {
    displayedItems: displayedMessages,
    isLoading,
    hasMore,
    loadingRef,
  } = useInfiniteScroll(messages, 20)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayedMessages])

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = mockMessages[selectedConversation.id] || []
      setMessages(conversationMessages)
      
      // Mark messages as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, unreadCount: 0, isActive: true }
            : { ...conv, isActive: false }
        )
      )
    }
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "1", // Current user
      receiverId: selectedConversation.userId,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      type: "text",
    }

    // Add message to conversation
    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message }
          : conv
      )
    )

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      // Simulate reply
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConversation.userId,
        receiverId: "1",
        content: "Gracias por el mensaje, te respondo pronto!",
        timestamp: new Date(),
        isRead: false,
        type: "text",
      }
      
      setMessages(prev => [...prev, reply])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Mensajes</h1>
            <Button variant="ghost" size="sm">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  conversation.isActive 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatar} />
                    <AvatarFallback>{conversation.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {conversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{conversation.user.username}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </p>
                </div>
                
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.user.avatar} />
                    <AvatarFallback>{selectedConversation.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.user.username}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.user.isOnline ? "En línea" : "Desconectado"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Infinite Scroll Loading */}
                {hasMore && (
                  <div ref={loadingRef} className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Cargando mensajes anteriores...</span>
                    </div>
                  </div>
                )}

                {/* Loading skeleton */}
                {isLoading && (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <MessageSkeleton key={`loading-${index}`} />
                    ))}
                  </div>
                )}

                {/* Messages */}
                {displayedMessages.map((message) => {
                  const isOwnMessage = message.senderId === "1"
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwnMessage ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isOwnMessage && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedConversation.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedConversation.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "max-w-xs lg:max-w-md",
                        isOwnMessage && "order-first"
                      )}>
                        <div className={cn(
                          "rounded-lg px-3 py-2",
                          isOwnMessage 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={cn(
                          "text-xs mt-1",
                          isOwnMessage ? "text-right" : "text-left",
                          "text-muted-foreground"
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConversation.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {selectedConversation.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] resize-none"
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </div>
                    <span>{newMessage.length}/1000</span>
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <MessageSkeleton />
              </div>
              <h3 className="text-lg font-semibold">Selecciona una conversación</h3>
              <p className="text-muted-foreground">
                Elige una conversación para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
