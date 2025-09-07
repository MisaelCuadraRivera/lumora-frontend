"use client"

import { useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, User, MoreHorizontal } from "lucide-react"
import { getBoardBySpace } from "@/data"
import type { KanbanBoard, Task } from "@/types"
import { NewTaskModal } from "./new-task-modal"
import { Checklist } from "./checklist"

interface KanbanBoardProps {
  spaceId: string
}

export function KanbanBoard({ spaceId }: KanbanBoardProps) {
  const [board, setBoard] = useState<KanbanBoard>(getBoardBySpace(spaceId))

  const addTask = (task: Omit<Task, "id"|"createdAt"|"updatedAt">) => {
    const id = Math.random().toString(36).slice(2)
    setBoard(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: { ...task, id, createdAt: new Date(), updatedAt: new Date() } as Task,
      },
      columns: prev.columns.map(c => c.id === task.status ? { ...c, taskIds: [...c.taskIds, id] } : c)
    }))
  }

  const updateChecklist = (taskId: string, checklist: any[]) => {
    setBoard(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], checklist, updatedAt: new Date() } }
    }))
  }

  const columns = board.columns
  const tasks = board.tasks

  const moveTask = (taskId: string, toColumnId: string) => {
    setBoard(prev => {
      const next = { ...prev, columns: prev.columns.map(c => ({ ...c, taskIds: [...c.taskIds] })) }
      next.columns.forEach(c => {
        const idx = c.taskIds.indexOf(taskId)
        if (idx >= 0) c.taskIds.splice(idx, 1)
      })
      const target = next.columns.find(c => c.id === toColumnId)
      if (target) target.taskIds.push(taskId)
      next.tasks = { ...next.tasks, [taskId]: { ...next.tasks[taskId], status: toColumnId as any, updatedAt: new Date() } }
      return next
    })
  }

  return (
    <div className="flex gap-4 overflow-x-auto">
      {columns.map(col => (
        <div key={col.id} className="w-80 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-sm">
              {col.title}
              <Badge variant="secondary" className="ml-2 text-xs">{col.taskIds.length}</Badge>
            </div>
            <NewTaskModal onCreate={addTask} />
          </div>
          <ScrollArea className="h-[70vh] pr-2">
            <div className="space-y-2">
              {col.taskIds.map(id => (
                <TaskCard key={id} task={tasks[id]} onMove={moveTask} onChecklistChange={(list) => updateChecklist(id, list)} />
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}

function TaskCard({ task, onMove, onChecklistChange }: { task: Task; onMove: (id: string, to: string) => void; onChecklistChange: (list: any[]) => void }) {
  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardHeader className="py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium text-sm leading-snug">{task.title}</div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={priorityToVariant(task.priority)}>{task.priority}</Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.dueDate.toLocaleDateString("es-MX", { month: "short", day: "2-digit" })}
            </div>
          )}
          {task.assignees?.[0] && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" /> {task.assignees[0].username}
            </div>
          )}
        </div>
        {task.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {task.tags.map(t => (
              <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
            ))}
          </div>
        )}

        {task.checklist && task.checklist.length > 0 && (
          <div className="mt-3">
            <Checklist items={task.checklist} onChange={onChecklistChange} />
          </div>
        )}

        <div className="mt-3 flex gap-1 flex-wrap">
          {task.status !== "backlog" && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onMove(task.id, "backlog")}>Backlog</Button>
          )}
          {task.status !== "todo" && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onMove(task.id, "todo")}>Por hacer</Button>
          )}
          {task.status !== "in_progress" && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onMove(task.id, "in_progress")}>Progreso</Button>
          )}
          {task.status !== "review" && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onMove(task.id, "review")}>Revisión</Button>
          )}
          {task.status !== "done" && (
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onMove(task.id, "done")}>Hecho</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function priorityToVariant(priority: Task["priority"]) {
  switch (priority) {
    case "urgent":
      return "destructive" as const
    case "high":
      return "secondary" as const
    case "medium":
      return "outline" as const
    default:
      return "outline" as const
  }
}
