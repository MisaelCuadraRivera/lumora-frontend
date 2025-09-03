"use client"

import { useState, useRef, useEffect } from "react"
import { Hash, Search, Pin, Mic, Video, Paperclip, Smile, MoreHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatSidebar } from "./chat-sidebar"
import { MessageItem } from "./message-item"
import { ChatInput } from "./chat-input"
import { MembersSidebar } from "./members-sidebar"
import { ChatSearch } from "./chat-search"
import { VoiceChannels } from "./voice-channels"
import { VideoCallInterface } from "./video-call-interface"
import { PinnedMessages } from "./pinned-messages"
import { FileSharing } from "./file-sharing"
import { enhancedMessages, channels, getUnreadNotificationsCount } from "@/data"
import type { Message, VoiceUser, VideoParticipant } from "@/types"

interface ChatInterfaceProps {
  spaceId: string
}

export function ChatInterface({ spaceId }: ChatInterfaceProps) {
  const [activeChannelId, setActiveChannelId] = useState("general")
  const [chatMessages, setChatMessages] = useState<Message[]>(enhancedMessages)
  const [showSearch, setShowSearch] = useState(false)
  const [showVoiceChannels, setShowVoiceChannels] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showPinnedMessages, setShowPinnedMessages] = useState(false)
  const [showFileSharing, setShowFileSharing] = useState(false)
  const [currentVoiceUser, setCurrentVoiceUser] = useState<VoiceUser>({
    id: "current-user",
    name: "Alex",
    avatar: "/admin-avatar.png",
    isMuted: false,
    isDeafened: false,
    isSpeaking: false,
    joinedAt: new Date()
  })
  const [currentVideoUser, setCurrentVideoUser] = useState<VideoParticipant>({
    id: "current-user",
    name: "Alex",
    avatar: "/admin-avatar.png",
    isHost: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    joinedAt: new Date()
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId)
  const channelMessages = chatMessages.filter((m) => m.channelId === activeChannelId)
  const pinnedMessagesCount = chatMessages.filter(m => m.channelId === activeChannelId && m.isPinned).length

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        ;(scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight
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
        avatar: "/admin-avatar.png",
        role: "Administrador",
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

  const handlePinMessage = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((message) => ({
        ...message,
        isPinned: message.id === messageId ? !message.isPinned : message.isPinned,
      }))
    )
  }

  const handleJoinVoiceChannel = (channelId: string) => {
    setShowVoiceChannels(true)
    console.log("Joined voice channel:", channelId)
  }

  const handleLeaveVoiceChannel = () => {
    setShowVoiceChannels(false)
    console.log("Left voice channel")
  }

  const handleToggleMute = () => {
    setCurrentVoiceUser(prev => ({ ...prev, isMuted: !prev.isMuted }))
    setCurrentVideoUser(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const handleToggleDeafen = () => {
    setCurrentVoiceUser(prev => ({ ...prev, isDeafened: !prev.isDeafened }))
  }

  const handleStartVideoCall = (channelId: string) => {
    setShowVideoCall(true)
    console.log("Started video call in channel:", channelId)
  }

  const handleToggleVideo = () => {
    setCurrentVideoUser(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))
  }

  const handleToggleScreenShare = () => {
    setCurrentVideoUser(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }))
  }

  const handleEndCall = () => {
    setShowVideoCall(false)
  }

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files)
    // TODO: Implement file upload logic
  }

  const getPinnedMessagesLocal = (channelId: string) => {
    return chatMessages.filter(message => 
      message.channelId === channelId && message.isPinned
    )
  }

  return (
    <div className="flex h-full bg-slate-950">
      {/* Left Sidebar - Channels */}
      <ChatSidebar spaceId={spaceId} activeChannelId={activeChannelId} onChannelSelect={setActiveChannelId} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-slate-400" />
            <span className="font-semibold text-white">{activeChannel?.name}</span>
            <span className="text-sm text-slate-400 ml-2">{activeChannel?.description}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {pinnedMessagesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                className="text-slate-400 hover:text-white"
              >
                <Pin className="w-4 h-4 mr-1" />
                {pinnedMessagesCount}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="text-slate-400 hover:text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceChannels(!showVoiceChannels)}
              className="text-slate-400 hover:text-white"
            >
              <Mic className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileSharing(true)}
              className="text-slate-400 hover:text-white"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pinned Messages */}
        {showPinnedMessages && (
          <PinnedMessages
            channelId={activeChannelId}
            onClose={() => setShowPinnedMessages(false)}
            onMessageClick={(messageId) => {
              // Scroll to message
              console.log("Scroll to message:", messageId)
            }}
          />
        )}

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="py-4">
            {channelMessages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                onReact={handleReact} 
                onReply={handleReply}
                onPin={handlePinMessage}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput 
          channelName={activeChannel?.name || "general"} 
          onSendMessage={handleSendMessage}
          onFileUpload={() => setShowFileSharing(true)}
        />
      </div>

      {/* Right Sidebar - Members or Voice Channels */}
      {showVoiceChannels ? (
        <VoiceChannels
          spaceId={spaceId}
          currentUser={currentVoiceUser}
          onJoinChannel={handleJoinVoiceChannel}
          onLeaveChannel={handleLeaveVoiceChannel}
          onToggleMute={handleToggleMute}
          onToggleDeafen={handleToggleDeafen}
          onStartVideoCall={handleStartVideoCall}
        />
      ) : (
        <MembersSidebar spaceId={spaceId} />
      )}

      {/* Modals */}
      {showSearch && (
        <ChatSearch
          channelId={activeChannelId}
          onClose={() => setShowSearch(false)}
          onMessageClick={(messageId) => {
            // Scroll to message
            console.log("Scroll to message:", messageId)
          }}
        />
      )}

      {showVideoCall && (
        <VideoCallInterface
          spaceId={spaceId}
          currentUser={currentVideoUser}
          onClose={() => setShowVideoCall(false)}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onEndCall={handleEndCall}
        />
      )}

      {showFileSharing && (
        <FileSharing
          onClose={() => setShowFileSharing(false)}
          onFileUpload={handleFileUpload}
        />
      )}
    </div>
  )
}
