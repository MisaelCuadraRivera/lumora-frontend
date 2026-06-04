"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import Link from "next/link"

interface LikersModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: string
  targetType: "post" | "comment"
}

export function LikersModal({ isOpen, onClose, targetId, targetType }: LikersModalProps) {
  const [likers, setLikers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && targetId) {
      fetchLikers()
    }
  }, [isOpen, targetId])

  const fetchLikers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = targetType === "post" 
        ? await apiService.getPostLikes(targetId)
        : await apiService.getCommentLikes(targetId)
      
      if (response.success) {
        setLikers(response.data.likers)
      } else {
        setError(response.message || "Error al cargar los likes")
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center text-base">Likes</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px]">
          {loading && (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="link" onClick={fetchLikers} className="mt-2">
                Reintentar
              </Button>
            </div>
          )}

          {!loading && !error && likers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">Aún no hay likes.</p>
            </div>
          )}

          {!loading && !error && likers.length > 0 && (
            <div className="p-2 space-y-1">
              {likers.map((user) => (
                <Link 
                  key={user.id} 
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full h-8">
                    Ver perfil
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
