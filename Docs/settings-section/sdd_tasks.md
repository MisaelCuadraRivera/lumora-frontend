# Spec-Driven Development: Implementation Tasks
## Change: settings-section

Detailed checklist of tasks to implement the completed settings section.

### Phase 1: API Layer Endpoints
- [ ] **Task 1.1**: Add `changePassword`, `updatePreferences`, `exportUserData`, and `deleteAccount` methods to `ApiService` inside `lib/api.ts`.

### Phase 2: Preferences Synchronization
- [ ] **Task 2.1**: Refactor `handleNotificationSettingsChange` in `app/settings/page.tsx` to invoke `apiService.updatePreferences` on state updates.
- [ ] **Task 2.2**: Refactor `handlePrivacySettingsChange` in `app/settings/page.tsx` to invoke `apiService.updatePreferences` on state updates.
- [ ] **Task 2.3**: Refactor `handleAppearanceSettingsChange` in `app/settings/page.tsx` to invoke `apiService.updatePreferences` on state updates.

### Phase 3: Password Update Form
- [ ] **Task 3.1**: Bind "Contraseña actual" and "Nueva contraseña" inputs to active local state variables inside the Security section in `app/settings/page.tsx`.
- [ ] **Task 3.2**: Refactor `handleChangePassword` to apply strength and length validations, display loading indicators, call the backend mutation, clear inputs, and toast success/failure.

### Phase 4: Danger Zone Operations & Deletion Confirmation Modal
- [ ] **Task 4.1**: Connect `handleExportData` in `app/settings/page.tsx` to call `apiService.exportUserData`.
- [ ] **Task 4.2**: Design and render a warning dialogue `<Dialog>` confirmation warning modal in `app/settings/page.tsx` for account deletion.
- [ ] **Task 4.3**: Refactor `handleDeleteAccount` to call `apiService.deleteAccount`, invoke `logout()` from `useAuth`, invalidate credentials, and redirect to `/login` upon success.
