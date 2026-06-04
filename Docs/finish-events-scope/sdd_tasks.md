# Spec-Driven Development: Plan de Tareas (Tasks)
## Cambio: finish-events-scope

Este documento detalla el checklist de tareas ordenadas cronológicamente para implementar y consolidar el Módulo de Eventos.

---

### 📋 Lista de Tareas (Implementation Checklist)

#### **Fase 1: Conexión de Vistas de Detalle y Estado de Asistencia**
- [ ] **Tarea 1.1**: Importar y consumir los métodos mutadores de asistencia (`attendEvent` y `cancelAttendance`) y de administración (`deleteEvent`) en [`app/events/[id]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/events/[id]/page.tsx).
- [ ] **Tarea 1.2**: Sincronizar reactivamente el estado local `isAttending` en el montaje del componente mapeando los asistentes reales devueltos (`event.attendees`) contra el identificador del usuario autenticado (`user.id`).
- [ ] **Tarea 1.3**: Reemplazar stubs estáticos y mocks visuales de conteo de asistentes por la longitud real de la lista de `event.attendees`.

#### **Fase 2: Formularios de Creación y Modal de Edición con S3**
- [ ] **Tarea 2.1**: Asegurar que `complete-create-event-modal.tsx` e `edit-event-modal.tsx` bloqueen los botones de envío y muestren loaders de carga activa (`isUploading`) mientras los archivos binarios de banners se transmiten a AWS S3 mediante `uploadFileToS3`.
- [ ] **Tarea 2.2**: Conectar el formulario de edición `edit-event-modal.tsx` para inicializar y precargar correctamente todos los valores existentes del evento seleccionado (títulos, descripciones, fechas, visibilidades, precios y banners).
- [ ] **Tarea 2.3**: Mapear el envío del formulario de edición para despachar `apiService.updateEvent(eventId, payload)`, cerrar el modal, y refrescar la vista de detalles individuales tras recibir éxito de la API.

#### **Fase 3: Seguridad, Formateadores e Integración de Medios**
- [ ] **Tarea 3.1**: Implementar la lógica de propiedad `isCreator` evaluando si el `event.creatorId` o `event.creator?.id` coincide con el `user.id` actual, y ocultar/proteger los botones de edición y eliminación si no se es el propietario.
- [ ] **Tarea 3.2**: Conectar la acción de borrado físico del evento para disparar una confirmación nativa, ejecutar `deleteEvent`, desplegar un toast de éxito e iniciar el redireccionamiento del router hacia el catálogo `/events`.
- [ ] **Tarea 3.3**: Aplicar de forma exhaustiva el formateador centralizado `getMediaUrl` importado de `lib/mediaService.ts` en todos los renders de imágenes, banners y avatares de speakers de la página de detalle.
- [ ] **Tarea 3.4**: Refactorizar la función `formatPrice` para Normalizar correctamente strings numéricos de precios, forzar la visualización de "Gratis" en valores nulos/cero, y concatenar la divisa "MXN" de forma explícita.
- [ ] **Tarea 3.5**: Extender la validación de exclusión de asistencia para el organizador al componente de tarjeta de catálogo (`event-card.tsx`), inhabilitando el botón de RSVP, bloqueando la acción handleRSVP en el frontend, y resolviendo de forma reactiva el estado inicial de `isRegistered`.
- [ ] **Tarea 3.6**: Reemplazar los cuadros de confirmación nativos del navegador (`window.confirm`) por componentes premium controlados `AlertDialog` de Shadcn/Radix tanto en la página de detalles (`EventDetailPage`) como en las tarjetas de catálogo (`EventCard`), aislando la propagación de clics.
