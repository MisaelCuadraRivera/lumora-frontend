# Propuesta: Integración de Datos Reales en Espacios Vivos con SWR (Fases 1 y 2)

## Intent
Resolver la desconexión entre el frontend y el backend en el módulo de Espacios Vivos migrando de datos mockeados a peticiones reales de base de datos. Se utilizará SWR para el manejo de caché, revalidación y actualizaciones optimistas en la interfaz.

## Scope

### In Scope
- Instalar la librería `swr` como dependencia para la sincronización de estado de servidor.
- Crear el hook custom `hooks/useSpacePosts.ts` usando SWR para traer las publicaciones reales del espacio (`getSpacePosts`).
- Crear el hook custom `hooks/useSpaceTasks.ts` usando SWR para traer (`getTasks`), crear (`createTask`), actualizar (`updateTask`), mover (`moveTask`) y eliminar (`deleteTask`) tareas reales.
- Diseñar la estrategia de UI Optimista (Optimistic UI) para el tablero Kanban de tareas usando la función `mutate` de SWR.

### Out of Scope
- Refactorizar las pestañas especializadas de Música, Tecnología y Tienda (se aplazarán a fases posteriores).
- Conectar los componentes de galería y miembros a la base de datos (se mantendrán con mock por falta de endpoints en el backend actual).

## Capabilities

### New Capabilities
- `space-real-posts`: Habilidad de listar y crear publicaciones persistidas en el backend por cada espacio individual.
- `space-real-tasks`: Habilidad de administrar y mover tareas en un tablero Kanban persistido en tiempo real en la base de datos de cada espacio.

### Modified Capabilities
- None

## Approach
1. Instalar la librería `swr` e inicializar un componente proveedor o configuración global si es necesario (o usar llamadas locales de `useSWR` con la instancia `apiService`).
2. Implementar los custom hooks en la capa de dominio/hooks. Los hooks consumirán los métodos correspondientes de `apiService` (`lib/api.ts`).
3. Diseñar la estrategia de UI Optimista en `useSpaceTasks` para que las transiciones de columnas en el Kanban ocurran de forma instantánea mientras la petición de red PUT a `/tasks/:id/move` se procesa en segundo plano.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Agregar la librería `swr` a dependencias del proyecto. |
| `hooks/useSpacePosts.ts` | New | Hook para carga y caché de posts utilizando SWR. |
| `hooks/useSpaceTasks.ts` | New | Hook para administración y mutaciones de tareas con UI optimista. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Desincronización del caché ante múltiples mutaciones seguidas | Med | Utilizar revalidaciones automáticas e inyecciones de rollback con `swr` en caso de error. |
| Respuestas de error de red sin revertir estado local | Low | Configurar los bloques Try-Catch de las mutaciones optimistas para devolver el estado anterior (`previousData`). |

## Rollback Plan
Revertir los cambios usando Git en el frontend e ignorar las nuevas declaraciones de hooks, regresando a la importación directa desde `@/data`.

## Dependencies
- Instalar la dependencia `swr`.
- Disponibilidad del backend local en `http://localhost:3001/api`.

## Success Criteria
- [ ] La librería `swr` se encuentra instalada en el frontend.
- [ ] El hook `useSpacePosts` realiza una petición REST real a la base de datos filtrando por `spaceId`.
- [ ] El hook `useSpaceTasks` permite leer y actualizar de forma reactiva y optimista las tareas reales de la base de datos del espacio.
