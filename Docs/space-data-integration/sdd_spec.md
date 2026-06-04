# Especificación: Integración de Datos Reales en Espacios Vivos con SWR (Fases 1 y 2)

## Dominio: space-real-posts
Este dominio cubre la obtención de publicaciones/discusiones específicas de un espacio vivo desde el servidor utilizando SWR.

### Requisito: Obtención Reactiva de Publicaciones por Espacio
El sistema DEBE solicitar al backend las publicaciones que pertenezcan únicamente al `spaceId` provisto mediante el hook `useSpacePosts`.

#### Escenario: Carga exitosa de posts del espacio
- GIVEN un `spaceId` válido y conexión a internet estable.
- WHEN se renderiza la pestaña de discusiones del espacio.
- THEN el sistema realiza una llamada GET a `/posts/space/{id}` mediante SWR, actualiza la caché y dibuja los posts.

#### Escenario: El espacio no tiene publicaciones
- GIVEN un `spaceId` válido sin publicaciones registradas en el backend.
- WHEN se renderiza la pestaña de discusiones del espacio.
- THEN el sistema muestra un estado vacío indicando que no hay discusiones en este espacio.

---

## Dominio: space-real-tasks
Este dominio describe el comportamiento del tablero Kanban de tareas conectado a la base de datos a través de SWR, soportando interfaz optimista (Optimistic UI).

### Requisito: Carga Reactiva de Tareas
El sistema DEBE consultar y listar las tareas de la base de datos pertenecientes al `spaceId` mediante el hook `useSpaceTasks`.

### Requisito: Creación de Tarea en Base de Datos
El sistema DEBE permitir la creación de una tarea y su persistencia mediante una llamada POST al backend.

### Requisito: Movimiento Optimista de Columna
El sistema DEBE mover la tarea visualmente a la columna de destino al instante, antes de que el servidor responda, revalidando la caché tras la confirmación de red.

#### Escenario: Movimiento de tarea exitoso
- GIVEN una tarea en la columna "todo" (Por hacer).
- WHEN el usuario mueve la tarea a la columna "in_progress" (En progreso).
- THEN la tarea se desplaza visualmente al instante y se despacha la petición POST a `/tasks/{id}/move`.

#### Escenario: Reversión ante fallo del servidor (Rollback)
- GIVEN una tarea en la columna "todo".
- WHEN el usuario la mueve a "in_progress" y la petición al backend falla (error de red o 500).
- THEN la tarea regresa automáticamente a la columna "todo" y se notifica el fallo al usuario mediante un toast destructivo.
