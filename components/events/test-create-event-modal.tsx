"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Plus } from "lucide-react"

interface TestCreateEventModalProps {
  children?: React.ReactNode
}

export function TestCreateEventModal({ children }: TestCreateEventModalProps) {
  const [open, setOpen] = useState(false)

  console.log('TestCreateEventModal render:', { open, children: !!children })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Crear Nuevo Evento (Prueba)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>Este es un modal de prueba para verificar que el botón funciona.</p>
          <Button onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
