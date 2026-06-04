# Spec-Driven Development: Specifications
## Change: finish-profile-section

This specification details the behavioral requirements, user scenarios, and acceptance criteria for completing the profile and facet management section.

### 1. Edit Profile Redirection
- **Description**: The "Editar perfil" action in `<ProfileHeader>` must successfully route owners to their profile settings.
- **Scenarios**:
  - **Scenario 1.1: Clicking Edit Profile on Own Dashboard**
    - **Given** a user is logged in and viewing their own dashboard at `/profile`.
    - **When** they click "Editar perfil".
    - **Then** the application routes them to `/settings` with the `"profile"` tab selected by default.
  - **Scenario 1.2: Clicking Edit Profile on Own Public Profile**
    - **Given** a user is viewing their own public profile page at `/user/[username]`.
    - **When** they click "Editar perfil".
    - **Then** the application routes them to `/settings` with the `"profile"` tab selected by default.

### 2. Real Facet Manager & Modal Actions
- **Description**: Facet manager mutations must call the `useFacets` hooks and connect with the backend database.
- **Scenarios**:
  - **Scenario 2.1: Activating a Facet in the List**
    - **Given** a user is on `/profile/facets` viewing their facets.
    - **When** they click "Activar" on an inactive facet.
    - **Then** the UI shows a loader, executes `toggleFacet(facetId)`, displays a "Faceta activada" toast, updates the local list, and triggers `refreshUser()` to sync the active facet across the sidebar/header.
  - **Scenario 2.2: Deleting a Facet**
    - **Given** a user is managing their facets.
    - **When** they click the "Delete" icon on a facet card.
    - **Then** the UI triggers `deleteFacet(facetId)`. On success, it displays a "Faceta eliminada" toast and removes the card from the UI.
  - **Scenario 2.3: Creating a Facet via FacetModal**
    - **Given** a user opens the facet creator modal.
    - **When** they fill out name, type, description, bio, privacy, and click "Crear Faceta".
    - **Then** `createFacet` is executed. On success, a toast is shown, the modal closes, and the facet list is refreshed.
  - **Scenario 2.4: Editing an Existing Facet**
    - **Given** a user opens the edit facet modal.
    - **When** they modify details and click "Guardar Cambios".
    - **Then** `updateFacet(facetId, facetData)` is called. On success, a toast is shown, the modal closes, and the list updates.

### 3. Dynamic Living Spaces loading
- **Description**: The spaces displayed under a facet must be fetched dynamically from the database.
- **Scenarios**:
  - **Scenario 3.1: Active Facet Spaces Loading**
    - **Given** a user is viewing `/profile`.
    - **When** the active facet is rendered.
    - **Then** the application queries the backend for spaces associated with the active facet.
    - **And** renders them inside the `<LivingSpaces>` component instead of mock values.
  - **Scenario 3.2: Empty Spaces State**
    - **Given** a facet has no associated living spaces.
    - **When** the tab is rendered.
    - **Then** it shows a clean empty state with a call to action to "Crear nuevo Espacio".

### 4. User Profile Social Interactions
- **Description**: All interactive social buttons on a user's public profile must connect to backend endpoints.
- **Scenarios**:
  - **Scenario 4.1: Following another user**
    - **Given** a user is visiting `/user/[username]` (not their own profile).
    - **When** they click "Seguir".
    - **Then** an API request is sent, the button shows a loading state, and transitions to "Siguiendo" on success.
  - **Scenario 4.2: Direct Messaging**
    - **Given** a user is on another user's profile.
    - **When** they click "Mensaje".
    - **Then** the app redirects them to the messages dashboard with the recipient's thread selected.
  - **Scenario 4.3: Liking & Commenting on Profile Feed**
    - **Given** a user is viewing posts on another user's profile feed.
    - **When** they click "Like" or submit a comment on a post.
    - **Then** the corresponding `apiService` mutations (`toggleLike`, `addComment`) are successfully dispatched, and counters update instantly.
