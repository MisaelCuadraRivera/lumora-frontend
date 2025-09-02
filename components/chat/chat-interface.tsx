"use client"

import { useState, useRef, useEffect } from "react"
import { Hash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatSidebar } from "./chat-sidebar"
import { MessageItem } from "./message-item"
import { ChatInput } from "./chat-input"
import { MembersSidebar } from "./members-sidebar"
import { messages, channels } from "@/data"
import type { Message } from "@/types"

interface ChatInterfaceProps {
  spaceId: string
}

export function ChatInterface({ spaceId }: ChatInterfaceProps) {
  const [activeChannelId, setActiveChannelId] = useState("general")
  const [chatMessages, setChatMessages] = useState<Message[]>(messages)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId)
  const channelMessages = chatMessages.filter((m) => m.channelId === activeChannelId)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [channelMessages])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      author: {
        id: "current-user",
        name: "Alex",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Artista",
      },
      channelId: activeChannelId,
      createdAt: new Date(),
      reactions: [],
    }

    setChatMessages((prev) => [...prev, newMessage])
  }

  const handleReact = (messageId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const existingReaction = message.reactions?.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...message,
              reactions: message.reactions?.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
            }
          } else {
            return {
              ...message,
              reactions: [...(message.reactions || []), { emoji, count: 1 }],
            }
          }
        }
        return message
      }),
    )
  }

  const handleReply = (messageId: string) => {
    // TODO: Implement reply functionality
    console.log("Reply to message:", messageId)
  }

  return (
    <div className="flex h-full bg-slate-950">
      {/* Left Sidebar - Channels */}
      <ChatSidebar spaceId={spaceId} activeChannelId={activeChannelId} onChannelSelect={setActiveChannelId} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 px-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/30">
          <Hash className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-white">{activeChannel?.name}</span>
          <span className="text-sm text-slate-400 ml-2">{activeChannel?.description}</span>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="py-4">
            {channelMessages.map((message) => (
              <MessageItem key={message.id} message={message} onReact={handleReact} onReply={handleReply} />
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput channelName={activeChannel?.name || "general"} onSendMessage={handleSendMessage} />
      </div>

      {/* Right Sidebar - Members */}
      <MembersSidebar spaceId={spaceId} />
    </div>
  )
}
