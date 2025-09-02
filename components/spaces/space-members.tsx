"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Crown, Shield, ExternalLink } from "lucide-react"

interface Member {
  id: string
  username: string
  avatar?: string
  role: "admin" | "moderator" | "member"
  isOnline: boolean
  facet?: string
}

interface SpaceMembersProps {
  members: Member[]
  totalMembers: number
  onViewAll?: () => void
}

const roleIcons = {
  admin: Crown,
  moderator: Shield,
  member: Users,
}

const roleLabels = {
  admin: "Admin",
  moderator: "Moderadora",
  member: "Miembro",
}

const roleColors = {
  admin: "text-yellow-500",
  moderator: "text-blue-500",
  member: "text-muted-foreground",
}

export function SpaceMembers({ members, totalMembers, onViewAll }: SpaceMembersProps) {
  const onlineMembers = members.filter((m) => m.isOnline)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Miembros Activos</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{onlineMembers.length} en línea</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Moderators */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Moderadores — 2</h4>
            <div className="space-y-2">
              {members
                .filter((m) => m.role === "admin" || m.role === "moderator")
                .slice(0, 2)
                .map((member) => {
                  const RoleIcon = roleIcons[member.role]
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {member.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{member.username}</p>
                          <RoleIcon className={`h-3 w-3 ${roleColors[member.role]}`} />
                        </div>
                        <p className="text-xs text-muted-foreground">{roleLabels[member.role]}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Regular Members */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Miembros — 6</h4>
            <div className="space-y-2">
              {members
                .filter((m) => m.role === "member")
                .slice(0, 6)
                .map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {member.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.username}</p>
                      {member.facet && <p className="text-xs text-muted-foreground">{member.facet}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
