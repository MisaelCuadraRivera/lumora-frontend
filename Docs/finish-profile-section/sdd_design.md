# Spec-Driven Development: Technical Design
## Change: finish-profile-section

### 1. File Modification Map
We modified the following files in a clean, SOLID-compliant manner:
- **`app/profile/page.tsx`**
  - Imported `useRouter` from `next/navigation`.
  - Imported `useSpaces` from `@/hooks/useSpaces`.
  - Declared `const router = useRouter()` and passed `onEdit={() => router.push('/settings')}` to `<ProfileHeader>`.
  - Fetched user spaces using `useSpaces` hook and mapped them dynamically to `<LivingSpaces>`.
- **`app/user/[username]/page.tsx`**
  - Imported `useRouter` from `next/navigation`.
  - Instantiated `const router = useRouter()`.
  - Passed `onEdit={() => router.push('/settings')}` to `<ProfileHeader>`.
  - Integrated follow, message, join/leave space, and feed interactions with `apiService`.
- **`components/profile/facet-manager.tsx`**
  - Imported `refreshUser` from `useAuth` hook.
  - Imported `useFacets` and filtered dynamic facets.
  - Hooked up delete and active toggling to mutate states in the DB.
  - Passed `onSuccess={refreshFacets}` to `<FacetModal>`.
- **`components/profile/facet-modal.tsx`**
  - Accepted `onSuccess?: () => void` prop.
  - Used `useFacets({ autoFetch: false })` hook inside.
  - Mapped selection attributes (`"type"` to `"category"`) and triggered backend saves.
  - Synced form states using `useEffect` on facet changes.
- **`components/social/social-actions.tsx`**
  - Connected follow/unfollow and block/unblock requests to `apiService`.
  - Upgraded DM thread navigation using client-side Next routing.
- **`lib/api.ts`**
  - Declared `toggleFollow(userId)` and `toggleBlock(userId)` within `apiService` class.

### 2. Dynamic Spaces Mapping Logic
To bridge the gap between `Space` and `<LivingSpaces>`'s expected UI models:
```typescript
const mappedSpaces = spaces.map(space => ({
  id: space.id,
  title: space.name,
  description: space.description,
  image: space.image,
  type: (space.category === "proyecto" ? "project" : 
         space.category === "comunidad" ? "collaboration" : 
         space.category === "tienda" ? "portfolio" : "blog") as "portfolio" | "blog" | "collaboration" | "project",
  stats: {
    members: space.memberCount,
  }
}))
```
