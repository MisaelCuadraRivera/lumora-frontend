"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { mockUsers, getUserById } from "@/data"
import { User, UserPlus, UserMinus, UserX, Flag, MessageSquare, Share2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SocialActionsProps {
  targetUser: User
  onFollowChange?: (userId: string, isFollowing: boolean) => void
  onBlockChange?: (userId: string, isBlocked: boolean) => void
}

export function SocialActions({ targetUser, onFollowChange, onBlockChange }: SocialActionsProps) {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(
    currentUser ? targetUser.followers.includes(currentUser.id) : false
  )
  const [isBlocked, setIsBlocked] = useState(
    currentUser ? targetUser.blockedUsers.includes(currentUser.id) : false
  )
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  if (!currentUser || currentUser.id === targetUser.id) {
    return null
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollowChange?.(targetUser.id, !isFollowing)
    
    toast({
      title: isFollowing ? "Dejaste de seguir" : "Siguiendo",
      description: isFollowing 
        ? `Ya no sigues a ${targetUser.username}` 
        : `Ahora sigues a ${targetUser.username}`,
    })
  }

  const handleBlock = () => {
    setIsBlocked(!isBlocked)
    onBlockChange?.(targetUser.id, !isBlocked)
    
    toast({
      title: isBlocked ? "Desbloqueado" : "Bloqueado",
      description: isBlocked 
        ? `Desbloqueaste a ${targetUser.username}` 
        : `Bloqueaste a ${targetUser.username}`,
    })
  }

  const handleReport = () => {
    if (!reportReason || !reportDescription) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    // Simular envío del reporte
    toast({
      title: "Reporte enviado",
      description: "Gracias por reportar. Revisaremos el contenido.",
    })
    
    setShowReportDialog(false)
    setReportReason("")
    setReportDescription("")
  }

  const handleMessage = () => {
    // Redirigir a mensajes privados
    window.location.href = `/messages?user=${targetUser.username}`
  }

  const handleShare = () => {
    // Compartir perfil
    if (navigator.share) {
      navigator.share({
        title: `${targetUser.username} en Lumora`,
        url: `/user/${targetUser.username}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/user/${targetUser.username}`)
      toast({
        title: "Enlace copiado",
        description: "El enlace del perfil se copió al portapapeles",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleFollow}
        className="gap-2"
      >
        {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        {isFollowing ? "Dejar de seguir" : "Seguir"}
      </Button>

      <Button variant="outline" size="sm" onClick={handleMessage} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Mensaje
      </Button>

      <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Compartir
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleBlock} className="gap-2">
            <UserX className="h-4 w-4" />
            {isBlocked ? "Desbloquear" : "Bloquear"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowReportDialog(true)} className="gap-2 text-red-600">
            <Flag className="h-4 w-4" />
            Reportar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar a {targetUser.username}</DialogTitle>
            <DialogDescription>
              Ayúdanos a mantener la comunidad segura reportando contenido inapropiado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Motivo del reporte</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Acoso</SelectItem>
                  <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                  <SelectItem value="fake_news">Noticias falsas</SelectItem>
                  <SelectItem value="copyright">Violación de derechos de autor</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                placeholder="Proporciona más detalles sobre el reporte..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleReport} className="bg-red-600 hover:bg-red-700">
                Enviar Reporte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
