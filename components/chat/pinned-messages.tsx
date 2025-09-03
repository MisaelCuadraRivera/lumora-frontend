"use client"

import { useState } from "react"
import { Pin, X, MessageSquare, FileText, Image, Video, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from "@/data"
import { getPinnedMessages } from "@/data"
import type { Message } from "@/types"

interface PinnedMessagesProps {
  channelId: string
  onClose: () => void
  onMessageClick: (messageId: string) => void
}

export function PinnedMessages({ channelId, onClose, onMessageClick }: PinnedMessagesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pinnedMessages = getPinnedMessages(channelId)

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (pinnedMessages.length === 0) {
    return null
  }

  return (
    <div className={`bg-slate-800/50 border-b border-slate-700 transition-all duration-300 ${
      isExpanded ? 'h-64' : 'h-16'
    }`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">
            Mensajes anclados ({pinnedMessages.length})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <ScrollArea className="h-48 px-3 pb-3">
          <div className="space-y-3">
            {pinnedMessages.map((message) => (
              <div
                key={message.id}
                className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => onMessageClick(message.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <img src={message.author.avatar} alt={message.author.name} />
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-white">{message.author.name}</span>
                      {message.author.role && (
                        <Badge variant="secondary" className="text-xs">
                          {message.author.role}
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(message.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-300 line-clamp-2 mb-2">
                      {message.content}
                    </p>
                    
                    {message.attachment && (
                      <div className="flex items-center gap-2 p-2 bg-slate-600/50 rounded border border-slate-500">
                        {getAttachmentIcon(message.attachment.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {message.attachment.name}
                          </div>
                          {message.attachment.size && (
                            <div className="text-xs text-slate-400">
                              {formatFileSize(message.attachment.size)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {reaction.emoji} {reaction.count}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
