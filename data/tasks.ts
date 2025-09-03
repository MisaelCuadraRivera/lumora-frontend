import type { KanbanBoard, Task, TaskStatus, TaskPriority } from "@/types"

const now = new Date()

const demoTasks: Record<string, Task> = {
  "t-1": {
    id: "t-1",
    spaceId: "space-1",
    title: "Diseñar banner del espacio",
    description: "Crear banner en formato 1920x480 con el nuevo branding",
    status: "todo",
    priority: "high",
    assignees: [{ id: "u-1", username: "alex", avatar: "/admin-avatar.png" }],
    dueDate: new Date(now.getTime() + 3 * 86400000),
    tags: ["branding", "diseño"],
    checklist: [
      { id: "c-1", content: "Moodboard", done: true },
      { id: "c-2", content: "Primer boceto", done: false },
      { id: "c-3", content: "Exportar variantes", done: false },
    ],
    comments: [],
    createdAt: now,
    updatedAt: now,
  },
  "t-2": {
    id: "t-2",
    spaceId: "space-1",
    title: "Configurar módulos del espacio",
    description: "Activar chat, posts y marketplace. Dejar eventos en draft",
    status: "in_progress",
    priority: "medium",
    assignees: [{ id: "u-2", username: "sarah", avatar: "/curator-avatar.png" }],
    tags: ["espacios", "config"],
    checklist: [
      { id: "c-1", content: "Activar chat", done: true },
      { id: "c-2", content: "Activar posts", done: true },
      { id: "c-3", content: "Activar marketplace", done: false },
    ],
    comments: [],
    createdAt: now,
    updatedAt: now,
  },
  "t-3": {
    id: "t-3",
    spaceId: "space-1",
    title: "Roadmap público",
    status: "backlog",
    priority: "low",
    assignees: [],
    tags: ["roadmap"],
    checklist: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
  },
  "t-4": {
    id: "t-4",
    spaceId: "space-1",
    title: "QA de editor TipTap",
    description: "Probar SSR y placeholders en móvil",
    status: "review",
    priority: "urgent",
    assignees: [{ id: "u-1", username: "alex" }],
    tags: ["qa"],
    checklist: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
  },
}

export const mockKanbanBoard: KanbanBoard = {
  spaceId: "space-1",
  columns: [
    { id: "backlog", title: "Backlog", taskIds: ["t-3"] },
    { id: "todo", title: "Por hacer", taskIds: ["t-1"] },
    { id: "in_progress", title: "En progreso", taskIds: ["t-2"] },
    { id: "review", title: "Revisión", taskIds: ["t-4"] },
    { id: "done", title: "Hecho", taskIds: [] },
  ],
  tasks: demoTasks,
}

export function getBoardBySpace(spaceId: string): KanbanBoard {
  // En un futuro, clonar/filtrar por espacio
  return { ...mockKanbanBoard, spaceId }
}

export function getTasksByStatus(spaceId: string, status: TaskStatus): Task[] {
  const board = getBoardBySpace(spaceId)
  const ids = board.columns.find(c => c.id === status)?.taskIds || []
  return ids.map(id => board.tasks[id]).filter(Boolean)
}

export function getTask(spaceId: string, taskId: string): Task | undefined {
  const board = getBoardBySpace(spaceId)
  return board.tasks[taskId]
}
