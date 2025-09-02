import { Users, Shield, Pin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockUsers } from "@/data"

interface MembersSidebarProps {
  spaceId: string
}

export function MembersSidebar({ spaceId }: MembersSidebarProps) {
  // Mock pinned messages
  const pinnedMessages = [
    {
      id: "1",
      content:
        "Calendario de Octubre actualizado. Ruta de lectura de Hyperion y sesión de debate el jueves 28 a las 19:00. ¡Traigan sus teorías! #anuncios",
      author: "Lia — Moderadora",
    },
  ]

  // Mock online members - using the actual user structure
  const moderators = mockUsers.filter((u) => 
    u.facets.some(f => f.name === "Moderadora" || f.name === "Admin")
  ).slice(0, 2)
  
  const onlineMembers = mockUsers.filter((u) => 
    !u.facets.some(f => f.name === "Moderadora" || f.name === "Admin")
  ).slice(0, 6)

  return (
    <div className="w-60 bg-slate-900/50 border-l border-slate-800 flex flex-col">
      {/* Pinned Messages */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Pin className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-white">Mensajes Anclados</span>
        </div>

        <div className="space-y-2">
          {pinnedMessages.map((message) => (
            <div key={message.id} className="p-2 bg-slate-800/30 rounded text-xs text-slate-300 leading-relaxed">
              <div className="text-purple-400 font-medium mb-1">{message.author}</div>
              {message.content}
            </div>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Moderators */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Moderadores — {moderators.length}
              </span>
            </div>

            <div className="space-y-2">
              {moderators.map((user) => {
                const activeFacet = user.facets.find(f => f.isActive) || user.facets[0]
                return (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{user.username}</div>
                      <div className="text-xs text-slate-400">{activeFacet?.name || "Miembro"}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Online Members */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Miembros — {onlineMembers.length}
              </span>
              <Badge variant="secondary" className="text-xs ml-auto">
                73 en línea
              </Badge>
            </div>

            <div className="space-y-2">
              {onlineMembers.map((user) => {
                const activeFacet = user.facets.find(f => f.isActive) || user.facets[0]
                return (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{user.username}</div>
                      <div className="text-xs text-slate-400">{activeFacet?.name || "Miembro"}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
