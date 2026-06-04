# Diseño: Integración de Datos Reales en Espacios Vivos con SWR (Fases 1 y 2)

Este documento detalla el diseño técnico para la integración de datos reales de base de datos en las secciones de discusiones y de tareas utilizando la librería SWR en Next.js.

## Technical Approach

Implementaremos la sincronización de estado utilizando la librería SWR de Vercel. SWR nos permitirá:
1. Tener una caché local global en memoria para las peticiones GET.
2. Actualizaciones optimistas rápidas en el tablero Kanban.
3. Revalidar en segundo plano al enfocar la ventana o reconectar la red.

Los custom hooks `useSpacePosts` y `useSpaceTasks` abstraerán los detalles del fetching y expondrán estados simplificados de datos (`posts` / `tasks`), carga (`loading`) y error (`error`), además de métodos de mutación asíncronas (`createPost`, `addTask`, `moveTask`, etc.).

## Architecture Decisions

| Decisión | Opción Elegida | Alternativas Consideradas | Razón / Justificación |
|----------|----------------|---------------------------|-----------------------|
| **Librería de Estado** | **SWR** | React Query (TanStack), React Context local | SWR es ligera, funciona "out of the box" sin necesidad de envolver la aplicación en Providers complejos en Next.js App Router, y soporta perfectamente mutaciones optimistas para el tablero Kanban. |
| **Manejo de Reorganización** | **Mutación Local Optimista con SWR** | Actualización síncrona esperando respuesta de red | El Drag-and-Drop requiere respuesta visual en milisegundos. Esperar a la red degradaría severamente la experiencia de usuario. La mutación optimista permite aplicar el cambio localmente al instante y revertir en caso de fallo. |

## Data Flow

### 1. Flujo de Lectura de Tareas / Publicaciones
```
[Componente UI] ──(Suscribe)──> [useSpaceTasks Hook] ──(useSWR)──> [SWR Cache (En Memoria)]
                                                                          │
                                                                   (Si expira o no existe)
                                                                          ▼
[Componente UI] <──(Dibuja)─── [Datos del Backend] <──(Retorna)─── [apiService GET]
```

### 2. Flujo de Movimiento Optimista (Drag & Drop en Kanban)
```
[DND Terminado] ──> [moveTask(taskId, targetColumn)]
                          │
                          ├─> [Mutación Optimista en SWR] ──> (Actualiza UI al instante)
                          │
                          ├─> [Llamada HTTP a /tasks/:id/move]
                          │         │
                          │         ├─> (Éxito) ──> [Confirmar Caché] ──> (Revalida en background)
                          │         │
                          │         └─> (Fallo) ──> [Rollback en SWR] ──> (Revierte UI + Toast de error)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Se añade `swr` a la sección de dependencias. |
| `hooks/useSpacePosts.ts` | Create | Custom hook para consultar posts filtrados por espacio. |
| `hooks/useSpaceTasks.ts` | Create | Custom hook para el CRUD y movimiento de tareas con SWR. |

## Interfaces / Contracts

### 1. Hook `useSpacePosts`
```typescript
interface UseSpacePostsReturn {
  posts: Post[]
  loading: boolean
  error: string | null
  createPost: (content: string, tags?: string[]) => Promise<{ success: boolean; message?: string }>
}
```

### 2. Hook `useSpaceTasks`
```typescript
interface UseSpaceTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  addTask: (taskData: any) => Promise<{ success: boolean; message?: string }>
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<{ success: boolean; message?: string }>
  deleteTask: (taskId: string) => Promise<{ success: boolean; message?: string }>
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit / Hook | Estados del hook `useSpaceTasks` | Mockear `apiService` para simular respuestas lentas y fallos, validando que el rollback de caché funcione. |
| Integration | Integración de Drag and Drop con el hook | Renderizar `<KanbanBoard>` y verificar que llama a `updateTaskStatus` del hook al soltar una tarjeta. |

## Migration / Rollout
No se requiere migración de base de datos. El cambio es 100% retrocompatible y los endpoints ya existen en el backend de Lumora.

## Open Questions
- ¿El endpoint `GET /spaces/:id/tasks` devuelve la información en formato de lista plana (`Task[]`) o como un objeto `KanbanBoard` ya ordenado?
  * *Resolución:* Asumiremos una lista plana de `Task[]` y construiremos las columnas del tablero dinámicamente en el frontend para mayor flexibilidad, o nos adaptaremos a la estructura del backend si es necesario.
