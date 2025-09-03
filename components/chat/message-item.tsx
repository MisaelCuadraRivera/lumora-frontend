"use client"

import { useState } from "react"
import { Heart, MessageSquare, MoreHorizontal, Pin, FileText, Image, Video, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from "@/data"
import type { Message } from "@/types"

interface MessageItemProps {
  message: Message
  onReact: (messageId: string, reaction: string) => void
  onReply: (messageId: string) => void
  onPin?: (messageId: string) => void
}

export function MessageItem({ message, onReact, onReply, onPin }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  return (
    <div
      className={`group px-4 py-2 hover:bg-slate-800/30 transition-colors ${
        message.isPinned ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={message.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>{message.author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{message.author.name}</span>
            {message.author.role && (
              <Badge variant="secondary" className="text-xs">
                {message.author.role}
              </Badge>
            )}
            <span className="text-xs text-slate-400">{formatTimeAgo(message.createdAt)}</span>
            {message.isPinned && (
              <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                <Pin className="w-3 h-3 mr-1" />
                Anclado
              </Badge>
            )}
            {message.isEdited && (
              <span className="text-xs text-slate-500">(editado)</span>
            )}
          </div>

          <div className="text-slate-200 text-sm leading-relaxed">{message.content}</div>

          {message.attachment && (
            <div className="mt-2 max-w-md">
              {message.attachment.type.startsWith('image/') ? (
                <img
                  src={message.attachment.url || "/placeholder.svg"}
                  alt={message.attachment.name}
                  className="rounded-lg max-h-64 object-cover"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  {getAttachmentIcon(message.attachment.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {message.attachment.name}
                    </div>
                    {message.attachment.size && (
                      <div className="text-xs text-slate-400">
                        {formatFileSize(message.attachment.size)}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Descargar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs bg-slate-800/50 hover:bg-slate-700/50"
                  onClick={() => onReact(message.id, reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Message Actions */}
        {isHovered && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              onClick={() => onReact(message.id, "👍")}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              onClick={() => onReply(message.id)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            {onPin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                onClick={() => onPin(message.id)}
              >
                <Pin className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
