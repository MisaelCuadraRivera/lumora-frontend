"use client"

import { useState, useRef, useEffect } from "react"
import { X, Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Settings, Users, Phone, PhoneOff, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getVideoCallsBySpace } from "@/data"
import type { VideoCall, VideoParticipant } from "@/types"

interface VideoCallInterfaceProps {
  spaceId: string
  currentUser: VideoParticipant
  onClose: () => void
  onToggleMute: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onEndCall: () => void
}

export function VideoCallInterface({
  spaceId,
  currentUser,
  onClose,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall
}: VideoCallInterfaceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const videoCalls = getVideoCallsBySpace(spaceId)
  const activeCall = videoCalls.find(call => call.isActive)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulate video stream (in real app, this would be WebRTC)
    if (localVideoRef.current) {
      // Mock local video
      localVideoRef.current.srcObject = new MediaStream()
    }
  }, [])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!activeCall) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">Llamada en curso</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {activeCall.participants.length} participantes
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white hover:bg-white/10"
          >
            <Users className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video (Remote) */}
          <div className="w-full h-full bg-slate-800 relative">
            {activeCall.participants.filter(p => p.id !== currentUser.id && p.isVideoEnabled).map((participant) => (
              <div key={participant.id} className="absolute inset-0">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm">{participant.name}</span>
                  {participant.isHost && (
                    <Badge variant="secondary" className="ml-2 text-xs">Host</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {activeCall.participants.filter(p => p.id !== currentUser.id && !p.isVideoEnabled).map((participant) => (
              <div key={participant.id} className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <img src={participant.avatar} alt={participant.name} />
                  </Avatar>
                  <div className="text-white font-medium">{participant.name}</div>
                  <div className="text-slate-300 text-sm">Cámara apagada</div>
                </div>
              </div>
            ))}
          </div>

          {/* Local Video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-slate-700 rounded-lg overflow-hidden border-2 border-white/20">
            {currentUser.isVideoEnabled ? (
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="w-12 h-12">
                  <img src={currentUser.avatar} alt={currentUser.name} />
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {currentUser.name}
            </div>
          </div>

          {/* Screen Share Indicator */}
          {activeCall.participants.some(p => p.isScreenSharing) && (
            <div className="absolute top-4 left-4 bg-blue-500/90 px-3 py-1 rounded-lg">
              <div className="flex items-center gap-2 text-white text-sm">
                <Monitor className="w-4 h-4" />
                <span>Compartiendo pantalla</span>
              </div>
            </div>
          )}
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 bg-slate-900 border-l border-slate-800">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Participantes</h3>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {activeCall.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <img src={participant.avatar} alt={participant.name} />
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{participant.name}</span>
                        {participant.isHost && (
                          <Badge variant="secondary" className="text-xs">Host</Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {participant.isMuted ? "Silenciado" : "Activo"}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {participant.isMuted ? (
                        <MicOff className="w-4 h-4 text-red-400" />
                      ) : (
                        <Mic className="w-4 h-4 text-green-400" />
                      )}
                      {participant.isVideoEnabled ? (
                        <Video className="w-4 h-4 text-green-400" />
                      ) : (
                        <VideoOff className="w-4 h-4 text-red-400" />
                      )}
                      {participant.isScreenSharing && (
                        <Monitor className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6 bg-slate-900/90 backdrop-blur">
        <Button
          variant={currentUser.isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleMute}
          className="rounded-full w-12 h-12 p-0"
        >
          {currentUser.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <Button
          variant={currentUser.isVideoEnabled ? "secondary" : "destructive"}
          size="lg"
          onClick={onToggleVideo}
          className="rounded-full w-12 h-12 p-0"
        >
          {currentUser.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        <Button
          variant={currentUser.isScreenSharing ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleScreenShare}
          className="rounded-full w-12 h-12 p-0"
        >
          {currentUser.isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="rounded-full w-12 h-12 p-0"
        >
          <Settings className="w-5 h-5" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={onEndCall}
          className="rounded-full w-12 h-12 p-0"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
