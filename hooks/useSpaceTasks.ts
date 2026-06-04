"use client"

import useSWR from 'swr'
import { useCallback } from 'react'
import { apiService } from '@/lib/api'
import type { Task, KanbanBoard, TaskStatus, TaskColumn } from '@/types'

// Función para transformar una lista plana o estructura del backend en un KanbanBoard válido
const buildKanbanBoard = (tasksData: any, spaceId: string): KanbanBoard => {
  if (tasksData && !Array.isArray(tasksData) && tasksData.columns && tasksData.tasks) {
    return tasksData as KanbanBoard
  }

  const tasksArray: Task[] = Array.isArray(tasksData) ? tasksData : 
                             (tasksData?.tasks && Array.isArray(tasksData.tasks) ? tasksData.tasks : [])
  
  const columns: TaskColumn[] = [
    { id: "backlog", title: "Backlog", taskIds: [] },
    { id: "todo", title: "Por hacer", taskIds: [] },
    { id: "in_progress", title: "En progreso", taskIds: [] },
    { id: "review", title: "Revisión", taskIds: [] },
    { id: "done", title: "Hecho", taskIds: [] },
  ]
  const tasksRecord: Record<string, Task> = {}

  tasksArray.forEach((task: any) => {
    const normalizedTask: Task = {
      id: task.id || '',
      spaceId: task.spaceId || spaceId,
      title: task.title || '',
      description: task.description || '',
      status: (task.status || 'todo') as TaskStatus,
      priority: (task.priority || 'medium') as any,
      assignees: Array.isArray(task.assignees) ? task.assignees : [],
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      tags: Array.isArray(task.tags) ? task.tags : [],
      checklist: Array.isArray(task.checklist) ? task.checklist : [],
      comments: Array.isArray(task.comments) ? task.comments : [],
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
    }
    
    tasksRecord[normalizedTask.id] = normalizedTask
    const col = columns.find(c => c.id === normalizedTask.status)
    if (col) {
      col.taskIds.push(normalizedTask.id)
    }
  })

  return {
    spaceId,
    columns,
    tasks: tasksRecord
  }
}

export function useSpaceTasks(spaceId: string) {
  const fetcher = useCallback(async () => {
    if (!spaceId) return buildKanbanBoard([], spaceId)
    const response = await apiService.getTasks(spaceId)
    if (response.success && response.data) {
      return buildKanbanBoard(response.data, spaceId)
    }
    throw new Error(response.message || 'Error cargando tareas de este espacio')
  }, [spaceId])

  const { data: board, error, isLoading, mutate } = useSWR<KanbanBoard>(
    spaceId ? `/spaces/${spaceId}/tasks` : null,
    fetcher
  )

  const addTask = useCallback(async (taskData: any) => {
    if (!spaceId) return { success: false, message: 'Falta spaceId' }
    try {
      const response = await apiService.createTask(spaceId, taskData)
      if (response.success && response.data) {
        mutate() // Revalidar la lista completa del servidor
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || 'Error al crear tarea' }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [spaceId, mutate])

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    if (!board) return { success: false, message: 'Tablero no cargado' }
    
    const previousBoard = board

    // 1. Mutación optimista en SWR: reposicionar de inmediato en el cliente
    const optimisticBoard = { ...board }
    
    // Remover de la columna de origen
    optimisticBoard.columns = optimisticBoard.columns.map(col => {
      const index = col.taskIds.indexOf(taskId)
      if (index > -1) {
        const newTaskIds = [...col.taskIds]
        newTaskIds.splice(index, 1)
        return { ...col, taskIds: newTaskIds }
      }
      return col
    })
    
    // Agregar a la columna de destino
    optimisticBoard.columns = optimisticBoard.columns.map(col => {
      if (col.id === newStatus) {
        return { ...col, taskIds: [...col.taskIds, taskId] }
      }
      return col
    })
    
    // Cambiar estatus de la tarea
    if (optimisticBoard.tasks[taskId]) {
      optimisticBoard.tasks[taskId] = {
        ...optimisticBoard.tasks[taskId],
        status: newStatus,
        updatedAt: new Date()
      }
    }

    // Actualizar localmente sin revalidar inmediatamente
    mutate(optimisticBoard, { revalidate: false })

    // 2. Ejecutar la llamada al servidor
    try {
      const response = await apiService.moveTask(taskId, newStatus)
      if (!response.success) {
        throw new Error(response.message || 'Error al mover tarea en el backend')
      }
      mutate() // Revalidar en segundo plano para asegurar sincronía
      return { success: true }
    } catch (err: any) {
      // Rollback: restaurar el estado anterior en caso de fallo
      mutate(previousBoard, { revalidate: false })
      return { success: false, message: err.message || 'Error de conexión al mover la tarea' }
    }
  }, [board, mutate])

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const response = await apiService.deleteTask(taskId)
      if (response.success) {
        mutate() // Revalidar la lista
        return { success: true }
      }
      return { success: false, message: response.message || 'Error al eliminar tarea' }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }, [mutate])

  return {
    board,
    loading: isLoading,
    error: error ? error.message : null,
    addTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: mutate
  }
}
