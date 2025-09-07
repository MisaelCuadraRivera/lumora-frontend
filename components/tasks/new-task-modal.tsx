"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import type { Task, TaskPriority } from "@/types"
import { Checklist } from "./checklist"

interface NewTaskModalProps {
  onCreate: (task: Omit<Task, "id"|"createdAt"|"updatedAt">) => void
  triggerClassName?: string
}

export function NewTaskModal({ onCreate, triggerClassName }: NewTaskModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState<string>("")
  const [checklist, setChecklist] = useState([] as any)

  const reset = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setChecklist([])
  }

  const create = () => {
    if (!title.trim()) return
    onCreate({
      spaceId: "space-1",
      title: title.trim(),
      description: description.trim() || undefined,
      status: "todo",
      priority,
      assignees: [],
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: [],
      checklist,
      comments: [],
    } as any)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}><Plus className="w-4 h-4 mr-1" /> Nueva tarea</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex items-center gap-2">
            <Select value={priority} onValueChange={(v: TaskPriority) => setPriority(v)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Prioridad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-44" />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Checklist</div>
            <Checklist items={checklist} onChange={setChecklist} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={create} disabled={!title.trim()}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
