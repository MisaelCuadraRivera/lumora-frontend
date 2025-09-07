"use client"

import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { KanbanBoard } from "@/components/tasks/kanban-board"

export default function SpaceTasksPage() {
  const params = useParams()
  const spaceId = String(params?.id || "space-1")
  const [priority, setPriority] = useState<string>("all")
  const [q, setQ] = useState("")

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Input placeholder="Buscar tareas..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Prioridad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-sm text-muted-foreground">
          <Badge variant="secondary">Espacio: {spaceId}</Badge>
        </div>
      </div>

      <KanbanBoard spaceId={spaceId} />
    </div>
  )
}
