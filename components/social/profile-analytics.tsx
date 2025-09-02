"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2,
  Calendar,
  Target,
  Award
} from "lucide-react"
import { mockPosts, mockUsers } from "@/data"
import type { User } from "@/types"

interface ProfileAnalyticsProps {
  user: User
}

export function ProfileAnalytics({ user }: ProfileAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  // Simular datos de analytics
  const userPosts = mockPosts.filter(post => post.authorId === user.id)
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalShares = userPosts.reduce((sum, post) => sum + post.shares, 0)
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0)

  const engagementRate = user.stats.followers > 0 
    ? ((totalLikes + totalComments + totalShares) / user.stats.followers * 100).toFixed(1)
    : "0"

  const weeklyStats = {
    posts: 12,
    likes: 234,
    comments: 45,
    shares: 23,
    views: 1234,
    followers: 56
  }

  const monthlyStats = {
    posts: 45,
    likes: 890,
    comments: 167,
    shares: 89,
    views: 4567,
    followers: 234
  }

  const yearlyStats = {
    posts: 156,
    likes: 3456,
    comments: 678,
    shares: 345,
    views: 15678,
    followers: 1234
  }

  const currentStats = timeRange === "week" ? weeklyStats : timeRange === "month" ? monthlyStats : yearlyStats

  const achievements = [
    { name: "Primer Post", description: "Publicaste tu primer contenido", icon: MessageSquare, earned: true },
    { name: "Influencer", description: "Alcanzaste 1000 seguidores", icon: Users, earned: user.stats.followers >= 1000 },
    { name: "Viral", description: "Un post alcanzó 1000 me gusta", icon: TrendingUp, earned: totalLikes >= 1000 },
    { name: "Consistente", description: "Publicaste 7 días seguidos", icon: Calendar, earned: false },
    { name: "Engagement", description: "Tasa de engagement > 5%", icon: Target, earned: parseFloat(engagementRate) > 5 },
    { name: "Comunidad", description: "Participaste en 10 espacios", icon: Award, earned: false }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Engagement</p>
                <p className="text-2xl font-bold">{engagementRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vistas Totales</p>
                <p className="text-2xl font-bold">{user.stats.views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Me Gusta Totales</p>
                <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Detallados</CardTitle>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
              <TabsList>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="year">Año</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value={timeRange} className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{currentStats.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{currentStats.likes}</div>
                <div className="text-sm text-muted-foreground">Me Gusta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{currentStats.comments}</div>
                <div className="text-sm text-muted-foreground">Comentarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{currentStats.shares}</div>
                <div className="text-sm text-muted-foreground">Compartidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{currentStats.views}</div>
                <div className="text-sm text-muted-foreground">Vistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-500">{currentStats.followers}</div>
                <div className="text-sm text-muted-foreground">Nuevos Seguidores</div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Logros y Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20" 
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.earned 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      achievement.earned ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {achievement.earned && (
                  <Badge variant="secondary" className="mt-2">
                    ¡Conseguido!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
