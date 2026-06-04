# Spec-Driven Development: Plan de Tareas (Tasks)
## Cambio: facets-section-integration

Este documento detalla el checklist de tareas técnicas organizadas de forma cronológica para implementar la integración unificada de la sección de facetas.

---

### 📋 Lista de Tareas (Implementation Checklist)

#### **Fase 1: Conmutador Rápido de Facetas en Sidebar**
- [ ] **Tarea 1.1**: Importar el hook `useFacets` y `useAuth` en [`components/layout/sidebar.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/layout/sidebar.tsx) para acceder a las facetas locales del usuario autenticado.
- [ ] **Tarea 1.2**: Importar e inyectar el componente `DropdownMenu` (`DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger`) en [`components/layout/sidebar.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/layout/sidebar.tsx) envolviendo la sección del avatar del usuario.
- [ ] **Tarea 1.3**: Listar las facetas del usuario en el desplegable, ordenándolas y mostrando un icono indicador o checkmark al costado de aquella que tenga `isActive === true`.
- [ ] **Tarea 1.4**: Asociar la acción del clic sobre una faceta inactiva para invocar `toggleFacet(facetId)`. Añadir un loader visual durante la carga y gatillar `refreshUser()` del contexto global de autenticación una vez completado el cambio con éxito.

#### **Fase 2: Conexión Real de Perfil Público a la API**
- [ ] **Tarea 2.1**: Refactorizar [`app/user/[username]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/user/%5Busername%5D/page.tsx) para importar y consumir el usuario de sesión desde `useAuth()`, reemplazando el stub `currentUser = mockUsers[0]`.
- [ ] **Tarea 2.2**: Agregar e implementar la petición asíncrona de obtención de perfil de usuario por username utilizando un método asíncrono en `apiService` (ej: `getUserByUsername(username)`) dentro de un `useEffect` controlado, manejando estados de carga (`loading`), errores (`error`) y almacenamiento en estado local (`profileUser`).
- [ ] **Tarea 2.3**: Conectar la lógica de seguimiento social (`isFollowing`, `handleFollow`), navegación de mensajes privados (`handleMessage`) e interacciones de publicaciones/miembro de espacios a las APIs reales del backend de Lumora.

#### **Fase 3: Pestaña de Facetas Públicas en Perfiles Ajenos**
- [ ] **Tarea 3.1**: Añadir la pestaña `"facets"` de tipo "Facetas" en el menú de navegación de pestañas de [`app/user/[username]/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/user/%5Busername%5D/page.tsx).
- [ ] **Tarea 3.2**: Filtrar las facetas del usuario visitado para aislar únicamente las facetas públicas (`privacy === 'public'`).
- [ ] **Tarea 3.3**: Mapear y renderizar las facetas públicas dentro de la pestaña en un grid responsivo consumiendo el componente `<FacetCard>` importado de `@/components/profile/facet-card` configurado con la propiedad `isOwner={false}`.
