# Spec-Driven Development: Proposal
## Change: finish-profile-section

### 1. Intent
The intent of this change is to complete the development of the User Profile and Facet Management sections in the Lumora frontend, replacing all visual mockups and dummy handlers with real production-ready backend integrations. This will establish a robust, state-of-the-art profile interface where user settings, active facets, social interactions, and living spaces function synchronously and survive page refreshes.

### 2. Scope
The scope is strictly limited to the Profile Section and its immediate subcomponents:
- **Profile Header & Navigation**: Hook up the "Editar perfil" button in `<ProfileHeader>` to navigate to the profile tab inside `/settings` or display a responsive drawer.
- **Facet Management Panel**: Integrate `FacetManager` and `FacetModal` with the `useFacets.ts` hook. Make sure facet creation, editing, activation, and deletion invoke real API requests instead of dummy toasts.
- **Living Spaces**: Replace hardcoded `mockLivingSpaces` in `/profile` with dynamic spaces fetched from the backend space API (filtered by the active facet). Connect the "Crear nuevo Espacio" card to the space creation workflow.
- **Social Action Handlers**: Fully integrate follower relations (follow/unfollow), direct message navigation, post interactions (like/comment/share), and space membership toggling (join/leave) on user profiles using `apiService`.

### 3. Technical Approach
- **State Synchronization**: Toggling or editing a facet must trigger a session-wide refresh via the `useAuth()` hook to ensure headers, sidebars, and feeds react instantly.
- **Clean Architecture & SOLID Hooks**:
  - UI components will act as Presentational layers that emit events.
  - State and API operations will be managed by Custom Hooks (`useFacets`, `useSpaces`, `useAuth`).
  - All communication will strictly funnel through `apiService` in `lib/api.ts`.
- **User Interface**: Retain beautiful Radix UI and Tailwind CSS 4 styles. Add smooth micro-animations using Framer Motion when sheets/modals open or close.

### 4. Risks & Mitigations
- **Session Desynchronization**: Toggling the active facet could cause mismatch between what the sidebar shows vs the profile page.
  *Mitigation*: Ensure `refreshUser()` or `refreshFacets()` is systematically called on success to invalidate cache.
- **Rate Limiting / Performance**: Dynamic loading of spaces for multiple facets can overwhelm the backend.
  *Mitigation*: Implement clean loading states and cancel pending queries on fast tab-switching.

### 5. Project Standards
- Use TypeScript for all new files.
- Prioritize components from `components/ui/` (Shadcn UI).
- All backend communication must pass through `lib/api.ts` (`apiService`).
- App Router layout standards.
