"use client"

import { useState } from "react"
import { Mic, MicOff, Headphones, HeadphoneOff, Users, Settings, Phone, PhoneOff, Video, VideoOff, Monitor, MonitorOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getVoiceChannelsBySpace } from "@/data"
import type { VoiceChannel, VoiceUser } from "@/types"

interface VoiceChannelsProps {
  spaceId: string
  currentUser: VoiceUser
  onJoinChannel: (channelId: string) => void
  onLeaveChannel: () => void
  onToggleMute: () => void
  onToggleDeafen: () => void
  onStartVideoCall: (channelId: string) => void
}

export function VoiceChannels({ 
  spaceId, 
  currentUser, 
  onJoinChannel, 
  onLeaveChannel, 
  onToggleMute, 
  onToggleDeafen,
  onStartVideoCall 
}: VoiceChannelsProps) {
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const voiceChannels = getVoiceChannelsBySpace(spaceId)

  const handleJoinChannel = (channelId: string) => {
    setActiveChannel(channelId)
    onJoinChannel(channelId)
  }

  const handleLeaveChannel = () => {
    setActiveChannel(null)
    onLeaveChannel()
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white mb-2">Canales de Voz</h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="w-4 h-4" />
          <span>{voiceChannels.reduce((acc, channel) => acc + channel.connectedUsers.length, 0)} conectados</span>
        </div>
      </div>

      {/* Voice Channels */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {voiceChannels.map((channel) => (
            <div
              key={channel.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeChannel === channel.id
                  ? "bg-slate-800 border border-slate-700"
                  : "hover:bg-slate-800/50"
              }`}
              onClick={() => handleJoinChannel(channel.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${
                      channel.isLive ? "bg-green-500" : "bg-slate-600"
                    }`} />
                    {channel.isLive && (
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{channel.name}</div>
                    <div className="text-xs text-slate-400">
                      {channel.connectedUsers.length}/{channel.maxParticipants} usuarios
                    </div>
                  </div>
                </div>
                {channel.recordingEnabled && (
                  <Badge variant="destructive" className="text-xs">
                    REC
                  </Badge>
                )}
              </div>

              {/* Connected Users */}
              {channel.connectedUsers.length > 0 && (
                <div className="mt-3 space-y-2">
                  {channel.connectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <img src={user.avatar} alt={user.name} />
                      </Avatar>
                      <span className="text-xs text-slate-300 flex-1">{user.name}</span>
                      <div className="flex items-center gap-1">
                        {user.isMuted ? (
                          <MicOff className="w-3 h-3 text-red-400" />
                        ) : user.isSpeaking ? (
                          <Mic className="w-3 h-3 text-green-400" />
                        ) : (
                          <Mic className="w-3 h-3 text-slate-400" />
                        )}
                        {user.isDeafened && (
                          <HeadphoneOff className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Current User Controls */}
      {activeChannel && (
        <>
          <Separator className="bg-slate-800" />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <img src={currentUser.avatar} alt={currentUser.name} />
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-white text-sm">{currentUser.name}</div>
                <div className="text-xs text-slate-400">Conectado</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentUser.isMuted ? "destructive" : "secondary"}
                size="sm"
                onClick={onToggleMute}
                className="flex-1"
              >
                {currentUser.isMuted ? (
                  <>
                    <MicOff className="w-4 h-4 mr-1" />
                    Desmutear
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-1" />
                    Mutear
                  </>
                )}
              </Button>

              <Button
                variant={currentUser.isDeafened ? "destructive" : "secondary"}
                size="sm"
                onClick={onToggleDeafen}
                className="flex-1"
              >
                {currentUser.isDeafened ? (
                  <>
                    <HeadphoneOff className="w-4 h-4 mr-1" />
                    Activar Audio
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4 mr-1" />
                    Silenciar
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartVideoCall(activeChannel)}
                className="flex-1"
              >
                <Video className="w-4 h-4 mr-1" />
                Video
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Monitor className="w-4 h-4 mr-1" />
                Pantalla
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLeaveChannel}
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
