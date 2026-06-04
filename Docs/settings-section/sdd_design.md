# Spec-Driven Development: Technical Design
## Change: settings-section

### 1. File Modification Map
We will modify the following key files in a clean, robust manner:
- **`lib/api.ts`**
  - Add missing endpoints to the `ApiService` class:
    - `changePassword(currentPassword, newPassword)`
    - `updatePreferences(preferences)`
    - `exportUserData()`
    - `deleteAccount()`
- **`app/settings/page.tsx`**
  - Import `useAuth` to extract `logout` callback.
  - Implement full preference saving synchronization:
    - Modify `handleNotificationSettingsChange`, `handlePrivacySettingsChange`, and `handleAppearanceSettingsChange` to trigger `apiService.updatePreferences` updates to the database.
  - Implement password modification logic inside `handleChangePassword` by capturing input fields, adding validation, and invoking `apiService.changePassword`.
  - Wire up data export trigger `handleExportData`.
  - Design and render a premium Radix UI `<Dialog>` confirmation warning modal for account deletion, verifying that the user typed `"ELIMINAR"` before permitting execution, then calling `apiService.deleteAccount` and `logout()`.

### 2. API Endpoints Code Addition
We will inject these methods inside `apiService` class in `lib/api.ts`:
```typescript
  async changePassword(currentPassword: string, newPassword: string) {
    return this.post('/auth/change-password', { currentPassword, newPassword })
  }

  async updatePreferences(preferences: any) {
    return this.put('/auth/preferences', preferences)
  }

  async exportUserData() {
    return this.get('/auth/export-data')
  }

  async deleteAccount() {
    return this.delete('/auth/profile')
  }
```

### 3. Settings Event Listener Architecture
We will refactor preference tab changes to dispatch to the backend database instantly with standard toast responses:
```
Toggle Switch/Select Option ➔ Local state updates ➔ API Call updatePreferences(payload) ➔ Toast success / rollback error
```

### 4. Danger Zone Deletion Flow
We will design a secure confirm dialog:
- Requires user to input exactly `"ELIMINAR"` to activate the deletion action.
- Executing will call `apiService.deleteAccount()`, invoke `logout()` from the authentication hook, display a goodbye toast, and clear browser cookies/tokens before routing to the login landing page.
