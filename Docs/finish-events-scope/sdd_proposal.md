# Spec-Driven Development: Propuesta (Proposal)
## Cambio: finish-events-scope

### 1. Intención (Intent)
La intención de este cambio es completar, consolidar y verificar el **Módulo de Eventos** en el frontend de Lumora, asegurando que todos los componentes visuales (catálogos de eventos, calendarios de visualización, creación de eventos simples y completos, modal de edición y la página de detalle individual) estén 100% conectados a los endpoints de la API del backend, manteniendo un estado persistente, robusto y libre de errores de sincronización.

### 2. Alcance (Scope)
El alcance de este cambio se centra en los archivos del enrutador de eventos y los componentes visuales de soporte:
- **Página de Detalle de Evento ([`app/events/[id]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/events/[id]/page.tsx))**:
  - Asegurar la carga dinámica del evento individual utilizando el servicio alternativo de lectura `getEventByIdWithoutIncrement` para evitar bloqueos y fallos en contadores.
  - Conectar los flujos reactivos de asistencia ("Asistir" y "Cancelar Asistencia") llamando a los endpoints del backend y refrescando la UI.
  - Agregar botones de acción administrativa protegidos (Editar y Eliminar) visibles únicamente para el creador del evento.
- **Catálogo de Eventos ([`components/events/event-catalog.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/events/event-catalog.tsx))**:
  - Integrar el filtrado avanzado (por categorías, etiquetas traducidas, rango de fechas y tipo de visibilidad) conectándolo con el hook `useEvents`.
  - Asegurar paginación fluida y carga asíncrona de datos reales.
- **Modal de Creación y Edición ([`components/events/complete-create-event-modal.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/events/complete-create-event-modal.tsx) y [`components/events/edit-event-modal.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/events/edit-event-modal.tsx))**:
  - Validar campos de entrada controlados (Título, descripción, fecha/hora de inicio y fin, precio en divisas como MXN/USD y tipo de ubicación).
  - Conectar el envío del formulario para despachar mutaciones de creación (`createEvent`) y edición (`updateEvent`) a la API, invalidando el caché del catálogo tras el éxito.
- **Eliminación y Gestión de Medios**:
  - Proteger la eliminación física del evento con un diálogo de confirmación visual nativo.
  - Asegurar la normalización de URLs de banners e imágenes mediante `getMediaUrl` para evitar enlaces rotos de archivos cargados.

### 3. Enfoque Técnico (Technical Approach)
- **Desacoplamiento Presentacional**: Las vistas de eventos actúan como componentes de presentación controlados por el hook `useEvents` que encapsula llamadas asíncronas y lógica de negocio.
- **Flujo de Mutaciones e Invalidation de Caché**:
  ```
  Interacción del Usuario ➔ Hook (useEvents) ➔ Petición API (apiService) ➔ Éxito ➔ Recarga del Listado (loadEvents) ➔ UI Reactiva
  ```
- **Normalización de Medios**: Filtrar todas las rutas de imágenes y avatares de speakers/creadores a través de un normalizador centralizado para resolver directorios locales `/uploads` contra el puerto del backend.

### 4. Riesgos y Mitigaciones (Risks & Mitigations)
- **Imágenes rotas de speakers/banners**: Las rutas guardadas en la base de datos de SQLite pueden referenciar carpetas locales del backend que no cargan correctamente en el frontend.
  *Mitigación*: Implementar una función robusta `getMediaUrl` que verifique si el string es una URL completa o una ruta relativa para concatenar el host del backend.
- **Fechas y Zonas Horarias Desalineadas**: Las diferencias horarias entre el servidor y el cliente local pueden provocar errores de visualización de calendarios.
  *Mitigación*: Tratar todas las entradas y salidas de fechas mediante strings estandarizados en formato ISO 8601.

### 5. Estándares del Proyecto (Project Standards)
- Mantener la arquitectura basada en hooks personalizados (`hooks/useEvents.ts`).
- Cumplir estrictamente con la regla de NO realizar builds manuales en producción.
- Documentar reportes de planeación dentro de `Docs/finish-events-scope/`.
