"use client"
import { Hash, Volume2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { channels } from "@/data"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  spaceId: string
  activeChannelId: string
  onChannelSelect: (channelId: string) => void
}

export function ChatSidebar({ spaceId, activeChannelId, onChannelSelect }: ChatSidebarProps) {
  const spaceChannels = channels.filter((c) => c.spaceId === spaceId)
  const textChannels = spaceChannels.filter((c) => c.type === "text")
  const voiceChannels = spaceChannels.filter((c) => c.type === "voice")

  return (
    <div className="w-60 bg-slate-900/50 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-semibold text-white">Cosmolectores</h2>
        <Button variant="ghost" size="sm" className="w-full justify-start mt-2 text-slate-400 hover:text-white">
          <Plus className="w-4 h-4 mr-2" />
          Crear Canal
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Text Channels */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Canales de texto</span>
            </div>
            {textChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start mb-1 text-slate-400 hover:text-white hover:bg-slate-800/50",
                  activeChannelId === channel.id && "bg-slate-800 text-white",
                )}
                onClick={() => onChannelSelect(channel.id)}
              >
                <Hash className="w-4 h-4 mr-2" />
                {channel.name}
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {channel.unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Voice Channels */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Canales de voz</span>
            </div>
            {voiceChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-1 text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {channel.name}
                {channel.connectedUsers && channel.connectedUsers > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {channel.connectedUsers}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
