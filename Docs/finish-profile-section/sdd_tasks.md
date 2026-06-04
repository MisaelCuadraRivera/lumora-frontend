# Spec-Driven Development: Implementation Tasks
## Change: finish-profile-section

Detailed checklist of tasks used to implement the completed profile and facet management section.

### Phase 1: Navigation & Header Routing
- [x] **Task 1.1**: Update `app/profile/page.tsx` to import `useRouter` and define the routing `onEdit` callback in `<ProfileHeader>`.
- [x] **Task 1.2**: Update `app/user/[username]/page.tsx` to import `useRouter` and define the routing `onEdit` callback in `<ProfileHeader>`.

### Phase 2: Facet Manager and Modal API Integration
- [x] **Task 2.1**: Refactor `components/profile/facet-manager.tsx` to consume the `useFacets` hook, replacing static references to `user?.facets` with dynamic hook-fetched facets.
- [x] **Task 2.2**: Integrate real API mutations in `facet-manager.tsx` for `handleDeleteFacet` and `handleActivateFacet` (including calling `refreshUser()` to trigger sidebar updates).
- [x] **Task 2.3**: Update `components/profile/facet-modal.tsx` to accept `onSuccess?: () => void` prop, import `useFacets`, and implement actual `createFacet` and `updateFacet` API mutations.
- [x] **Task 2.4**: Bind `onSuccess` callback from `facet-manager.tsx` to `<FacetModal>` invocations to trigger list refreshes.

### Phase 3: Dynamic Living Spaces
- [x] **Task 3.1**: Update `app/profile/page.tsx` to import and call the `useSpaces` hook.
- [x] **Task 3.2**: Implement the category mapping algorithm to transform `Space[]` into mapped profile `LivingSpace[]` models, binding the result to the `<LivingSpaces>` component.

### Phase 4: Social Interactions & Feed Connections
- [x] **Task 4.1**: Hook up the message direct route inside `app/user/[username]/page.tsx` (`handleMessage` routing to `/messages`).
- [x] **Task 4.2**: Integrate real follow/unfollow API functionality inside `UserProfilePage` using a dynamic load handler.
- [x] **Task 4.3**: Integrate `toggleLike` and `addComment` calls from `apiService` inside the public profile feed component handlers in `UserProfilePage`.
- [x] **Task 4.4**: Integrate `joinSpace` and `leaveSpace` API bindings inside `UserProfilePage`.
