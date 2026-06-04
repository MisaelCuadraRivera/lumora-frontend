# Spec-Driven Development: Proposal
## Change: settings-section

### 1. Intent
The intent of this change is to complete the development of the user **Settings Section** in the Lumora frontend, replacing all visual mockups, empty callbacks, and stubs with fully functional backend integrations. This will connect user preferences, password security changes, data exports, and dangerous zone operations to backend endpoints, keeping settings state durable, secure, and persistent.

### 2. Scope
The scope is limited to the Settings page ([`app/settings/page.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/app/settings/page.tsx)) and the supporting API layer:
- **API Endpoint Declarations**: Add missing REST endpoints in [`lib/api.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/lib/api.ts) for:
  - Password updating: `/auth/change-password`
  - Preferences persistence (privacy, notifications, appearance): `/auth/preferences`
  - Data export: `/auth/export-data`
  - Account deletion: `DELETE /auth/profile`
- **Security Section**: Connect `handleChangePassword` to dispatch actual credential updates. Add visual errors and loading indicators to the input fields.
- **Preference Settings Tabs**: Connect Notification Preferences, Privacy Configurations, and Appearance Settings changes to write to the backend database instantly on toggle.
- **Danger Zone / Advanced Actions**: Complete `handleExportData` and `handleDeleteAccount` flows, adding secure verification/confirmation modals before dispatching deletions.

### 3. Technical Approach
- **State Integration**: Connect custom local states (`notificationSettings`, `privacySettings`, `appearanceSettings`) to dynamic listeners that call `apiService.updatePreferences(settingsData)` on success.
- **Clean Architecture & SOLID Hooks**:
  - Funnel all settings mutations strictly through the `apiService` class in `lib/api.ts`.
  - Use Next.js client-side status feeds to update browser UI context in real-time.
  - Implement full confirmation dialogues to safeguard high-risk settings (such as deleting an account or changing credentials).

### 4. Risks & Mitigations
- **Unsaved Settings Stutters**: Frequent preference toggling could result in multiple API calls in quick succession, triggering server rate limits or database load.
  *Mitigation*: Implement a simple debounce or delay state on preference saving, or update preferences in batches.
- **Accidental Account Deletion**: Users could delete their accounts accidentally if they click the button without extra safeguards.
  *Mitigation*: Require typing the word `"ELIMINAR"` inside a warning dialogue confirmation input before activating the deletion call.

### 5. Project Standards
- Use TypeScript for all new code.
- Prioritize Radix UI / Shadcn styles and standard alerts.
- Adhere strictly to the `apiService` singleton communication.
