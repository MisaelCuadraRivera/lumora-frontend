"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Users, Eye, Heart, MessageSquare } from "lucide-react"
import type { User as UserType } from "@/types"

interface ProfileStatsProps {
  user: UserType
  showDetailed?: boolean
}

export function ProfileStats({ user, showDetailed = false }: ProfileStatsProps) {
  const stats = user.stats

  const statItems = [
    {
      label: "Posts",
      value: stats.posts,
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      label: "Seguidores",
      value: stats.followers,
      icon: Users,
      color: "text-green-500"
    },
    {
      label: "Siguiendo",
      value: stats.following,
      icon: User,
      color: "text-purple-500"
    },
    {
      label: "Me gusta",
      value: stats.likes,
      icon: Heart,
      color: "text-red-500"
    },
    {
      label: "Vistas",
      value: stats.views,
      icon: Eye,
      color: "text-orange-500"
    }
  ]

  if (!showDetailed) {
    return (
      <div className="flex items-center gap-4">
        {statItems.slice(0, 3).map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.label} className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
