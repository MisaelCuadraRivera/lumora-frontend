# Spec-Driven Development: Specifications
## Change: settings-section

This specification details the behavioral requirements, user scenarios, and acceptance criteria for completing the user settings section.

### 1. Password Security Updates
- **Description**: Users must be able to change their account credentials securely from the panel.
- **Scenarios**:
  - **Scenario 1.1: Successful Password Modification**
    - **Given** a logged-in user is on the Settings Security panel.
    - **When** they fill out "Contraseña actual", "Nueva contraseña", and click "Cambiar Contraseña".
    - **Then** the application triggers `apiService.changePassword(current, new)`.
    - **And** displays a "Contraseña actualizada" toast, and clears the password fields.
  - **Scenario 1.2: Incorrect Current Password**
    - **Given** a user is modifying their password.
    - **When** they provide an incorrect current password.
    - **Then** the API returns a validation error.
    - **And** the application displays a "Error" toast with the description "La contraseña actual es incorrecta".

### 2. Preference Persistence (Notifications, Privacy, Appearance)
- **Description**: Option toggles must save user preferences directly to the database.
- **Scenarios**:
  - **Scenario 2.1: Toggling Notification Switches**
    - **Given** a user is modifying email/push toggles or comment/like preferences.
    - **When** they toggle any notification switch.
    - **Then** the switch goes into loading, and executes `apiService.updatePreferences({ notifications: ... })`.
    - **And** displays a "Configuración actualizada" toast, persisting the state across browser reloads.
  - **Scenario 2.2: Updating Profile Privacy Level**
    - **Given** a user changes their profile visibility level (e.g., Public ➔ Solo amigos).
    - **When** they change the selection.
    - **Then** the app sends the updated visibility flag to the preferences API.
    - **And** toasts the success state.
  - **Scenario 2.3: Changing Appearance Theme**
    - **Given** a user changes their theme (Light ➔ Dark).
    - **When** the select option transitions.
    - **Then** the app persists the preference via `apiService`, updates the browser document body classes, and toasts the confirmation.

### 3. Danger Zone Actions
- **Description**: Ensure high-risk actions (exporting data and account deletion) are fully integrated and safeguarded.
- **Scenarios**:
  - **Scenario 3.1: Exporting Personal Data**
    - **Given** a user is on the Advanced Settings panel.
    - **When** they click "Exportar mis datos".
    - **Then** `apiService.exportUserData()` is triggered.
    - **And** shows a toast: "Exportación iniciada. Recibirás un email con tus datos en los próximos minutos."
  - **Scenario 3.2: Safely Deleting Account**
    - **Given** a user clicks "Eliminar cuenta" inside the danger zone.
    - **When** clicked.
    - **Then** the application opens a secure warning confirmation modal.
    - **And** demands the user to type `"ELIMINAR"` into an input before the confirm button becomes active.
    - **When** they type `"ELIMINAR"` and click confirm.
    - **Then** the app triggers `apiService.deleteAccount()`.
    - **And** invalidates the authentication token, logs them out, redirects to the login landing page, and displays a goodbye toast.
