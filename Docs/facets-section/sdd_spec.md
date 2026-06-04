# Spec-Driven Development: Especificaciones (Specs)
## Cambio: facets-section-integration

Este documento define detalladamente las especificaciones de comportamiento, los criterios de aceptación y los escenarios de prueba para la integración unificada de la sección de Facetas en el frontend de Lumora.

---

### 1. Escenarios de Comportamiento (User Scenarios)

#### **Escenario 1: Conmutador Rápido de Facetas en la Barra Lateral (Sidebar Quick-Switcher)**
*   **Dado** que un usuario autenticado visualiza cualquier página de la aplicación que contenga el Sidebar principal.
*   **Cuando** hace clic en la sección de usuario en la esquina inferior o superior del Sidebar (el bloque que muestra su nombre y faceta activa actual).
*   **Entonces** se despliega de manera fluida un menú desplegable (`DropdownMenu` de Radix/Shadcn) que lista todas las facetas pertenecientes al usuario.
*   **Y** la faceta que se encuentra actualmente activa se muestra visualmente resaltada con un indicador o checkmark.
*   **Cuando** el usuario hace clic en una faceta inactiva desde la lista:
    *   **Entonces** la interfaz muestra un indicador de carga (`Loader2` en rotación).
    *   **Y** despacha la petición al backend (`apiService.toggleFacet(facetId)`).
    *   **Al recibir éxito**, ejecuta el método `refreshUser()` del contexto de autenticación (`useAuth`).
    *   **Entonces** la interfaz de toda la aplicación se actualiza reactivamente: el nombre de la nueva faceta activa se refleja inmediatamente en el Sidebar, el Header de navegación, y los feeds locales se vuelven a solicitar utilizando los privilegios de la nueva faceta activa.

#### **Escenario 2: Carga Dinámica de Perfiles Públicos de Usuarios (Public Profile API Connection)**
*   **Dado** que un usuario navega a la URL `/user/[username]` de un usuario público.
*   **Cuando** la página se monta:
    *   **Entonces** se ejecuta una llamada asíncrona real al backend (`apiService.getUserByUsername(username)` o endpoint equivalente de perfil) en lugar de consultar stubs o mocks estáticos de `@/data`.
    *   **Y** se muestra un estado de carga global en caso de que la respuesta tarde.
*   **Si el usuario no existe**:
    *   **Entonces** se renderiza una vista limpia de "Usuario no encontrado" con un botón de redirección para volver al feed.
*   **Si el usuario existe y la petición tiene éxito**:
    *   **Entonces** se renderiza el `<ProfileHeader>` dinámicamente con su avatar real, biografía real y estadísticas en vivo (publicaciones, seguidores, seguidos) recuperadas de la base de datos.
    *   **Y** se evalúa la propiedad de pertenencia (`isOwner`): si el usuario de la sesión coincide con el usuario del perfil público, se inyectan controles de edición rápida; de lo contrario, se renderiza la barra de acciones sociales (`SocialActions`) conectada a peticiones reales.

#### **Escenario 3: Pestaña de Facetas Públicas de otros Usuarios**
*   **Dado** que un usuario visualiza el perfil público de otro usuario en `/user/[username]`.
*   **Cuando** selecciona la pestaña **"Facetas"**:
    *   **Entonces** el sistema lista de forma dinámica y filtrada únicamente las facetas del usuario visitado que tengan un nivel de privacidad `"public"`.
    *   **Y** cada tarjeta de faceta permite al visitante ver detalles, explorar los espacios vivos de esa faceta o interactuar socialmente según las preferencias de privacidad del propietario.
    *   **Si** el usuario visitado no tiene facetas configuradas como públicas, **Entonces** se muestra un mensaje vacío amigable: *"Este usuario no tiene facetas públicas en este momento."*

---

### 2. Reglas de Validación de Negocio (Business Rules)

1.  **Exclusión de Facetas Privadas en Perfiles Públicos**: Al listar las facetas de otro usuario, el frontend bajo ninguna circunstancia debe renderizar o revelar facetas marcadas como `"private"` o cuyos ajustes de privacidad restrinjan la visibilidad al usuario en sesión.
2.  **Sincronización de Contexto de Autenticación**: Toda mutación sobre el estado activo de una faceta (`isActive: true`) debe disparar inmediatamente la actualización del perfil almacenado en `localStorage` y en el estado global de React. Esto evita que los encabezados o tokens de autorización presenten discrepancias de rol.
3.  **Redirección y Limpieza de Feeds**: Al cambiar de identidad (faceta activa), las vistas activas que dependan de la identidad (como `/feed` o la sección de Espacios de `/profile`) deben gatillar una recarga automática de sus listados para garantizar que el usuario visualice únicamente el contenido alineado a su nuevo rol.
4.  **Aislamiento de Clics en la Barra Lateral**: El menú de conmutación rápida debe capturar y controlar la propagación de eventos para evitar que clics erróneos en el Sidebar disparen enlaces de redirección o colapsen el diseño móvil de forma inesperada.
