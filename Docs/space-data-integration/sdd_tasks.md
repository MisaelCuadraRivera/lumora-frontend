# Tareas: Integración de Datos Reales en Espacios Vivos con SWR (Fases 1 y 2)

## Fase 1: Infraestructura / Dependencias
- [x] 1.1 Instalar la librería `swr` como dependencia del proyecto en `package.json` utilizando `npm install swr --legacy-peer-deps`.

## Fase 2: Implementación de Custom Hooks
- [x] 2.1 Crear `hooks/useSpacePosts.ts` que implemente la consulta asíncrona de posts filtrados por espacio mediante `useSWR('/posts/space/${spaceId}', ...)` de `apiService.getSpacePosts(spaceId)`.
- [x] 2.2 Exponer en el hook `useSpacePosts` un método `createPost` que consuma `apiService.createPost` y gatille la mutación y revalidación local inmediata de la caché de SWR.
- [x] 2.3 Crear `hooks/useSpaceTasks.ts` que implemente la consulta de tareas mediante `useSWR('/spaces/${spaceId}/tasks', ...)` utilizando `apiService.getTasks(spaceId)`.
- [x] 2.4 Implementar métodos en `hooks/useSpaceTasks.ts` para crear (`createTask`), mover (`moveTask`), actualizar y borrar tareas.
- [x] 2.5 Desarrollar la lógica de UI Optimista en `useSpaceTasks.ts` para mover tareas entre columnas, de modo que `updateTaskStatus` actualice localmente la caché antes de recibir respuesta de red, e implemente rollback en caso de fallo en la API REST.

## Fase 3: Pruebas y Validación
- [ ] 3.1 Verificar mediante consola el comportamiento y los payloads HTTP GET y POST del hook `useSpacePosts`.
- [ ] 3.2 Probar la resiliencia del hook `useSpaceTasks` simulando una desconexión de red y corroborando el correcto rollback de posición en el estado Kanban local.
