"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GripVertical, Plus, X } from "lucide-react"
import type { TaskChecklistItem } from "@/types"

interface ChecklistProps {
  items: TaskChecklistItem[]
  onChange: (items: TaskChecklistItem[]) => void
}

export function Checklist({ items, onChange }: ChecklistProps) {
  const [draft, setDraft] = useState("")
  const [dragId, setDragId] = useState<string | null>(null)

  const toggle = (id: string) => {
    onChange(items.map(i => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  const remove = (id: string) => {
    onChange(items.filter(i => i.id !== id))
  }

  const add = () => {
    const text = draft.trim()
    if (!text) return
    onChange([...items, { id: Math.random().toString(36).slice(2), content: text, done: false }])
    setDraft("")
  }

  const onDragStart = (id: string) => setDragId(id)
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const next = [...items]
    const from = next.findIndex(i => i.id === dragId)
    const to = next.findIndex(i => i.id === targetId)
    if (from < 0 || to < 0) return
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
    setDragId(null)
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center gap-2 p-2 rounded border border-border bg-background"
          draggable
          onDragStart={() => onDragStart(item.id)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(item.id)}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Checkbox checked={item.done} onCheckedChange={() => toggle(item.id)} />
          <div className={`flex-1 text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.content}</div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => remove(item.id)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Nueva subtarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add()
          }}
        />
        <Button type="button" variant="secondary" onClick={add}>
          <Plus className="w-4 h-4 mr-1" /> Agregar
        </Button>
      </div>
    </div>
  )
}
