# Auditoría Arquitectónica del Perfil y Configuración — Lumora Frontend

Este documento contiene un análisis detallado de los componentes de perfil, facetas y configuración en la aplicación frontend de Lumora. Identifica elementos faltantes, integraciones simuladas (mockups) y problemas estructurales que deben resolverse para la fase de producción.

---

## 1. Edición de Perfil y Sincronización de Ajustes (Enlaces Rotos)
El cabezal de perfil del usuario está desconectado de la configuración real del perfil:

*   **El Botón "Editar Perfil" Inactivo**: En [`components/profile/profile-header.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/profile-header.tsx#L97-L103), el botón "Editar perfil" invoca un callback `onEdit`. Sin embargo, en [`app/profile/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/profile/page.tsx) y [`app/user/[username]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/user/%5Busername%5D/page.tsx), `<ProfileHeader>` se renderiza **sin** pasar la función `onEdit`. Al hacer clic en el botón, no ocurre nada.
    *   *Solución*: Redirigir a `/settings?tab=profile` o abrir un panel/modal interactivo de edición rápida.
*   **Acciones de Seguridad Simuladas**: En [`app/settings/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/settings/page.tsx#L167-L195), funciones clave de seguridad y gestión son simulaciones:
    *   `handleChangePassword()` no tiene integración con la API.
    *   `handleExportData()` solo muestra un `console.log`.
    *   `handleDeleteAccount()` no ejecuta confirmación real ni interactúa con endpoints de eliminación.
*   **Preferencias Volátiles**: Los cambios en Notificaciones, Privacidad y Apariencia se guardan en el estado local de React de manera efímera. Al actualizar el navegador, las configuraciones se pierden porque no se realiza ninguna llamada de actualización a la base de datos (por ejemplo, a un endpoint de preferencias de usuario).

---

## 2. Panel de Gestión de Facetas (Lógica Mockeada)
Aunque existe el hook personalizado [`useFacets.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/hooks/useFacets.ts) perfectamente conectado al backend, el panel de administración no lo consume:

*   **Acciones en `FacetManager` Simuladas**: En [`components/profile/facet-manager.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/facet-manager.tsx#L61-L80):
    *   `handleDeleteFacet` muestra un toast de éxito pero no llama al método `deleteFacet` del hook `useFacets`.
    *   `handleActivateFacet` solo muestra un toast y no llama a `toggleFacet`.
*   **Acciones en `FacetModal` Simuladas**: En [`components/profile/facet-modal.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/facet-modal.tsx#L85-L119), al guardar cambios o crear una faceta desde el panel, el guardado está mockeado:
    ```typescript
    try {
      // Aquí iría la lógica para guardar la faceta
      toast({
        title: mode === "create" ? "¡Faceta creada!" : "¡Faceta actualizada!",
        description: `"${facetData.name}" ha sido creada exitosamente`,
      })
      onClose()
    }
    ```
    *   *Solución*: Inyectar `useFacets` en `FacetModal` y consumir los métodos reales del backend.

---

## 3. Espacios Vivos (Living Spaces)
El concepto central de "Espacios Vivos" está representado por elementos puramente visuales y estáticos:

*   **Mockup de Espacios**: En [`app/profile/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/profile/page.tsx#L14-L39), se utiliza la constante `mockLivingSpaces` en lugar de realizar una llamada a la API para traer los espacios reales asociados a la faceta activa del usuario.
*   **Reorganización Inexistente**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx#L48-L51), se muestra un botón para *"Arrastrar para reorganizar tus espacios"*, pero no hay soporte real para Drag-and-Drop (DND) ni librerías asociadas.
*   **Acción de Creación Desactivada**: La tarjeta dashed de "Crear nuevo Espacio" no tiene un manejador de eventos `onClick` ni un modal asociado para definir y crear el espacio.

---

## 4. Acciones de Interacción Social (Simulaciones)
Al visitar el perfil de otro usuario ([`app/user/[username]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/user/%5Busername%5D/page.tsx)), las interacciones son simuladas en la consola:

*   **Seguir / Dejar de seguir**: `handleFollow()` solo cambia la bandera visual de estado pero no actualiza la base de datos de relaciones.
*   **Mensaje Directo**: `handleMessage()` únicamente imprime logs en consola sin redirigir al chat privado.
*   **Interacciones en Publicaciones y Espacios**:
    *   `handleLike()`, `handleComment()` y `handleSharePost()` son funciones vacías.
    *   `handleJoinSpace()` y `handleLeaveSpace()` no realizan llamadas API reales, a pesar de que el servicio `apiService` en [`lib/api.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/lib/api.ts) ya dispone de métodos como `joinSpace` y `leaveSpace`.

---

## 5. Tabla de Tareas Pendientes (Prioridades de Desarrollo)

| Módulo | Tarea Pendiente | Prioridad | Estado Actual |
| :--- | :--- | :--- | :--- |
| **Perfil** | Conectar `onEdit` en `ProfileHeader` para redirigir a `/settings?tab=profile` o abrir sheet de edición. | **CRÍTICA** | ❌ Faltante |
| **Perfil** | Sustituir `mockLivingSpaces` con una petición real filtrada por el ID de la faceta activa. | **ALTA** | ❌ Mockeado |
| **Configuración** | Persistir los cambios de privacidad, apariencia y notificaciones mediante API en lugar de solo en estado de React. | **ALTA** | ❌ Mockeado |
| **Configuración** | Conectar `handleChangePassword`, `handleExportData` y `handleDeleteAccount` con la API. | **ALTA** | ❌ Mockeado |
| **Facetas** | Refactorizar `FacetManager` y `FacetModal` para que ejecuten las mutaciones reales del hook `useFacets.ts` (`createFacet`, `updateFacet`, `deleteFacet`, `toggleFacet`). | **CRÍTICA** | ❌ Mockeado |
| **Social** | Conectar las funciones de interacción en `UserProfilePage` (`joinSpace`, `leaveSpace`, `toggleLike`, `addComment`, etc.) con sus correspondientes llamadas en `apiService`. | **ALTA** | ❌ Mockeado |
| **UX/UI** | Implementar Drag-and-Drop interactivo para reorganizar la posición de los Espacios Vivos. | **MEDIA** | ❌ Faltante |
| **UX/UI** | Vincular la tarjeta de creación de espacio con un modal interactivo para agregar nuevos portafolios/proyectos. | **MEDIA** | ❌ Faltante |
