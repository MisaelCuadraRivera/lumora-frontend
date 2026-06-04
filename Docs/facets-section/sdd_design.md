# Spec-Driven Development: Diseño Técnico (Design)
## Cambio: facets-section-integration

Este documento detalla el diseño de arquitectura, estructura de componentes y flujo de datos técnicos para unificar e integrar la sección de Facetas.

---

### 1. Arquitectura y Estructura de Componentes (Component Architecture)

```
[ Layout (App Router) ]
         │
         ├───► [ Sidebar Component ] (components/layout/sidebar.tsx)
         │          │
         │          └───► [ DropdownMenu (Radix) ] (Quick Facet Switcher)
         │                     ├──► Lista de Facetas (user.facets)
         │                     └──► Toggle Activo ──► apiService.toggleFacet() ──► refreshUser()
         │
         └───► [ Public Profile Page ] (app/user/[username]/page.tsx)
                    │
                    ├──► apiService.getUserByUsername() (Petición de Perfil Real)
                    │
                    ├──► Tabs Component
                    │      ├──► Pestaña "Publicaciones" ──► Mapeado a Posts del Backend
                    │      ├──► Pestaña "Espacios" ──► Mapeado a Espacios del Backend
                    │      └──► Pestaña "Facetas" ──► Renderiza <FacetCard> (Solo Públicas)
                    │
                    └──► SocialActions (follow/unfollow, join/leave reales)
```

---

### 2. Flujo de Datos Técnico (Data Flow & State Management)

#### **Flujo A: Conmutación Rápida de Faceta en Sidebar**
1. El usuario hace clic en el avatar/nombre de usuario en la barra lateral.
2. El contenedor abre un `DropdownMenu` de Radix UI.
3. Se inyecta el hook `useFacets({ autoFetch: true })` en el Sidebar para acceder a la lista en tiempo real de facetas locales del usuario y a la función `toggleFacet`.
4. Al seleccionar una faceta inactiva:
   - Se activa un loader visual en la línea de la faceta seleccionada.
   - Se despacha `await toggleFacet(facetId)`.
   - Tras el éxito de la petición, se invoca `await refreshUser()` de `useAuth` para invalidar y volver a consultar la sesión autenticada en todo el sitio web.
   - Los componentes de navegación y de feed escuchan la actualización del `user` en el contexto global de React y vuelven a renderizar automáticamente.

#### **Flujo B: Perfil Público y Facetas de Terceros**
1. Al acceder a `/user/[username]`, el componente funcional extrae `username` de `useParams()`.
2. Un `useEffect` despacha `apiService.getUserByUsername(username)`.
3. El estado de carga local `loading` se establece en `true` y se renderiza un esqueleto animado (`Loader2` o `SkeletonLoaders`).
4. Si la llamada es exitosa:
   - Se guarda el objeto `User` devuelto en el estado `profileUser`.
   - Se define `isOwner` comparando `profileUser.id === currentUser.id` (utilizando el usuario real del hook `useAuth()`).
   - Se filtran las facetas del usuario para la pestaña `"facets"`:
     ```typescript
     const publicFacets = profileUser.facets.filter(
       (f: any) => f.privacy === "public" || f.isPublic === true
     )
     ```
   - Las interacciones sociales en `<SocialActions>` y botones de seguir se conectan a `apiService.toggleFollow(profileUser.id)` de forma dinámica.

---

### 3. Ajustes de la API del Backend (API Endpoints Checked)

El servicio `apiService` de `lib/api.ts` dispone de los métodos necesarios:
- **`getFacets()`**: `GET /facets` - Obtiene las facetas de la sesión actual.
- **`toggleFacet(facetId)`**: `POST /facets/:id/toggle` - Activa una faceta en particular.
- **`getUserByUsername(username)`**: `GET /users/username/:username` (o endpoint correspondiente de consulta de perfil).
  *Nota*: Si el endpoint del backend no existiera o tuviera otra firma, implementaremos un método asíncrono en `apiService` mapeado al endpoint correcto de consulta de usuarios por username.

---

### 4. Riesgos Técnicos y Mitigaciones (Technical Risks)

1.  **Propagación y Enrutamiento Involuntario en Sidebar**:
    - *Riesgo*: Al hacer clic en un ítem de faceta del desplegable, la barra de navegación podría colapsar o interpretar el clic como una navegación al perfil del usuario.
    - *Mitigación*: Envolver el activador del desplegable de manera aislada y añadir controladores `e.stopPropagation()` y `e.preventDefault()` en todas las acciones del menú rápido.
2.  **Caché Sucio de Datos al Conmutar**:
    - *Riesgo*: Cambiar de faceta activa cambia las cabeceras de autorización de la identidad (si aplica) o la visibilidad de los feeds, pero los componentes montados en páginas hermanas (como `/feed`) no se enteran y muestran caché viejo.
    - *Mitigación*: Forzar que el router de Next.js refresque el feed o implementar un disparador de eventos global (`window.dispatchEvent` o un callback de contexto) que alerte a las vistas activas que deben invalidar sus llamadas a la API.
