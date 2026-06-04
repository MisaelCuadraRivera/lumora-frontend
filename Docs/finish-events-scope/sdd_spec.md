# Spec-Driven Development: Especificaciones (Specs)
## Cambio: finish-events-scope

Este documento detalla las especificaciones de comportamiento, criterios de aceptación y escenarios clave para el módulo de eventos.

---

### 1. Escenarios de Comportamiento (User Scenarios)

#### **Escenario 1: Navegación y Filtros en el Catálogo**
*   **Dado** que un usuario autenticado ingresa a la sección `/events`.
*   **Cuando** selecciona una categoría (ej. "Conferencia", "Taller", "Networking"), ingresa un término de búsqueda en la barra, o cambia los filtros de fecha.
*   **Entonces** el componente `EventCatalog` realiza una llamada paginada al backend (`GET /api/events`) a través del hook `useEvents`, mapeando y renderizando la lista de resultados coincidentes.
*   **Y** las etiquetas y categorías dinámicas se traducen correctamente al español para mantener consistencia visual.

#### **Escenario 2: Creación de un Evento (Con Éxito y Errores)**
*   **Dado** que un usuario abre el modal de creación (`complete-create-event-modal`).
*   **Cuando** completa todos los campos mandatorios con información válida:
    *   *Título*: Entre 5 y 100 caracteres.
    *   *Fechas*: Fecha/hora de inicio en el futuro, y fecha/hora de fin posterior a la de inicio.
    *   *Ubicación*: URL de mapa si es virtual, o dirección física si es presencial.
    *   *Precio*: Mayor o igual a 0. Divisa normalized (MXN o USD).
*   **Entonces** el modal despacha la petición al backend a través de `apiService.createEvent`.
*   **Y** al recibir respuesta exitosa, cierra el modal, muestra un toast de éxito, y refresca la lista local en el catálogo.
*   **Cuando** intenta enviar el formulario con campos obligatorios vacíos o fechas inválidas, **Entonces** se renderizan alertas visuales de color rojo (Shadcn/UI Form Errors) y se bloquea el envío de la petición.

#### **Escenario 3: Asistencia y Registro a un Evento**
*   **Dado** que un usuario visualiza la página de detalle individual `/events/:id`.
*   **Cuando** el usuario no está registrado en el evento y hace clic en "Asistir al Evento":
    *   **Entonces** el botón pasa a estado de carga, realiza la petición a `apiService.attendEvent(id)`.
    *   **Y** tras el éxito, actualiza reactivamente el estado local a `isAttending = true`, incrementa la cantidad de asistentes visuales y muestra un toast de confirmación.
*   **Cuando** el usuario ya está registrado y hace clic en "Cancelar Asistencia":
    *   **Entonces** el botón pasa a estado de carga, ejecuta `apiService.cancelAttendance(id)`.
    *   **Y** al finalizar con éxito, actualiza reactivamente el estado a `isAttending = false`, decrementa el conteo de asistentes y lanza un toast destructivo/informativo.

#### **Escenario 4: Edición y Eliminación por el Creador**
*   **Dado** que el usuario actual es el creador/dueño del evento (`isCreator === true`).
*   **Cuando** abre el modal de edición (`edit-event-modal`):
    *   **Entonces** los campos del formulario se inicializan correctamente cargando los valores reales del evento.
    *   **Y** al presionar "Guardar", despacha `apiService.updateEvent(id, data)` y recarga la página para mostrar los detalles actualizados.
*   **Cuando** hace clic en "Eliminar Evento":
    *   **Entonces** se lanza un modal de confirmación premium `AlertDialog` de Radix/Shadcn.
    *   **Si** el usuario cancela, se cierra el diálogo sin consecuencias.
    *   **Si** el usuario confirma, ejecuta `apiService.deleteEvent(id)`, muestra un toast de éxito y lo redirige automáticamente al catálogo en `/events`.

---

### 2. Reglas de Validación de Negocio (Business Rules)
1.  **Formato de Precios**: Los eventos gratuitos deben mostrar explícitamente "Gratis" en lugar de "$0.00". Si el evento tiene costo en MXN, el precio formateado debe concatenar "MXN" (ej. `$250.00 MXN`) para evitar confusiones de tipo de cambio.
2.  **Imágenes y Banners**: Toda ruta de imagen guardada relativa (ej. `/uploads/...`) debe pasar a través de `getMediaUrl` para renderizar contra el puerto correcto del backend, previniendo enlaces rotos.
3.  **Exclusión de Asistencia para Organizadores**: El creador u organizador del evento está imposibilitado de auto-registrarse como asistente. El frontend debe inhabilitar el botón de registro mostrando el estado "Eres el organizador", y la acción `handleAttend` debe bloquear lógicamente cualquier intento de envío de esta petición.
