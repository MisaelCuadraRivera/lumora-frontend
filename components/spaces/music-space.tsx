"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart, 
  Share2, 
  Download,
  Clock,
  Users,
  Calendar
} from "lucide-react"

interface MusicSpaceProps {
  spaceId: string
}

const mockPlaylist = [
  {
    id: "1",
    title: "Cosmic Dreams",
    artist: "Luna Nova",
    duration: "3:45",
    isPlaying: true,
    likes: 1247,
    plays: 15420
  },
  {
    id: "2", 
    title: "Digital Sunset",
    artist: "Neon Waves",
    duration: "4:12",
    isPlaying: false,
    likes: 892,
    plays: 12300
  },
  {
    id: "3",
    title: "Quantum Love",
    artist: "Stellar Beats",
    duration: "3:28",
    isPlaying: false,
    likes: 2156,
    plays: 18900
  }
]

const mockEvents = [
  {
    id: "1",
    title: "Live Session: Electronic Dreams",
    date: "2024-02-15",
    time: "20:00",
    location: "Sala Virtual",
    attendees: 45,
    maxAttendees: 100
  },
  {
    id: "2",
    title: "Music Production Workshop",
    date: "2024-02-20",
    time: "18:00", 
    location: "Discord",
    attendees: 23,
    maxAttendees: 50
  }
]

export function MusicSpace({ spaceId }: MusicSpaceProps) {
  return (
    <div className="space-y-6">
      {/* Now Playing */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Reproduciendo Ahora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Cosmic Dreams</h3>
              <p className="text-muted-foreground">Luna Nova</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="gap-1">
                  <Heart className="h-3 w-3" />
                  1,247
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  15,420 plays
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={65} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>2:24</span>
              <span>3:45</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="sm">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="lg" className="rounded-full">
              <Pause className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Playlist del Espacio
            </CardTitle>
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Reproducir Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPlaylist.map((track, index) => (
              <div key={track.id} className={`flex items-center gap-4 p-3 rounded-lg ${track.isPlaying ? 'bg-primary/10' : 'hover:bg-muted/50'} transition-colors`}>
                <div className="w-8 text-center text-sm text-muted-foreground">
                  {track.isPlaying ? (
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Heart className="h-3 w-3" />
                    {track.likes}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Eventos Musicales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.date} • {event.time} • {event.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees}/{event.maxAttendees}
                    </Badge>
                    <Progress 
                      value={(event.attendees / event.maxAttendees) * 100} 
                      className="w-20 h-2" 
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Unirse
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
