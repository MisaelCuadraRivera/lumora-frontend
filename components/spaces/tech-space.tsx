"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Code, 
  GitBranch, 
  Star, 
  Eye, 
  Fork, 
  TrendingUp, 
  Calendar,
  Users,
  BookOpen,
  Zap,
  Shield,
  Globe
} from "lucide-react"

interface TechSpaceProps {
  spaceId: string
}

const mockProjects = [
  {
    id: "1",
    name: "Lumora Core",
    description: "Sistema base de la plataforma social",
    language: "TypeScript",
    stars: 1247,
    forks: 89,
    issues: 12,
    lastUpdate: "2 días",
    status: "active"
  },
  {
    id: "2",
    name: "Quantum UI",
    description: "Componentes de interfaz cuántica",
    language: "React",
    stars: 892,
    forks: 45,
    issues: 5,
    lastUpdate: "1 semana",
    status: "active"
  },
  {
    id: "3",
    name: "Neural API",
    description: "API de inteligencia artificial",
    language: "Python",
    stars: 2156,
    forks: 156,
    issues: 23,
    lastUpdate: "3 días",
    status: "beta"
  }
]

const mockResources = [
  {
    id: "1",
    title: "Guía de Desarrollo Web3",
    type: "documentation",
    author: "Tech Team",
    downloads: 1247,
    rating: 4.8
  },
  {
    id: "2",
    title: "React 19 Best Practices",
    type: "tutorial",
    author: "Dev Community",
    downloads: 892,
    rating: 4.6
  },
  {
    id: "3",
    title: "AI Integration Patterns",
    type: "guide",
    author: "AI Lab",
    downloads: 2156,
    rating: 4.9
  }
]

const mockTrending = [
  { topic: "React 19", mentions: 1247, trend: "up" },
  { topic: "Web3", mentions: 892, trend: "up" },
  { topic: "AI", mentions: 2156, trend: "up" },
  { topic: "TypeScript", mentions: 1567, trend: "down" }
]

export function TechSpace({ spaceId }: TechSpaceProps) {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendencias Tecnológicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {mockTrending.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">#{item.topic}</h4>
                  <p className="text-sm text-muted-foreground">{item.mentions} menciones</p>
                </div>
                <Badge variant={item.trend === "up" ? "default" : "secondary"} className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {item.trend === "up" ? "↑" : "↓"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Proyectos Activos
            </CardTitle>
            <Button variant="outline" size="sm">
              <GitBranch className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{project.name}</h4>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <Fork className="h-3 w-3" />
                      {project.forks}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {project.issues} issues
                    </span>
                    <span>Actualizado {project.lastUpdate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <GitBranch className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recursos Compartidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockResources.map((resource) => (
              <div key={resource.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground">por {resource.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="gap-1">
                      <Download className="h-3 w-3" />
                      {resource.downloads}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" />
                      {resource.rating}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proyectos Activos</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Desarrolladores</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commits Hoy</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
