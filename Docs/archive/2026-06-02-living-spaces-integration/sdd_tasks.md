# Spec-Driven Development: Plan de Tareas (Tasks)
## Cambio: living-spaces-integration

**Estado**: PLANIFICADO (PLANNED)
**Fecha**: 2026-06-02
**Autor**: Antigravity (AI Senior Architect)

---

### 📋 Lista de Tareas (Implementation Checklist)

#### **Fase 1: Preparación y Modificación de la API y Hooks**
*   - [x] **Tarea 1.1**: En [`lib/api.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/lib/api.ts), añadir la firma y el cuerpo del método `updateSpacesOrder` para enviar la lista ordenada de IDs de espacios mediante un método `PUT` a `/spaces/reorder` (Reemplazado por almacenamiento local determinista en localStorage por falta de soporte en la API).
*   - [x] **Tarea 1.2**: En [`hooks/useSpaces.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/hooks/useSpaces.ts), declarar y exponer la función `updateSpacesOrder(orderedIds)` en el retorno del hook `useSpaces` (Reemplazado por localStorage).

#### **Fase 2: Conexión de Creación de Espacios con Faceta Activa**
*   - [x] **Tarea 2.1**: En [`components/spaces/create-space-modal.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/spaces/create-space-modal.tsx), añadir la prop opcional `facetId?: string` en la interfaz `CreateSpaceModalProps`.
*   - [x] **Tarea 2.2**: En [`components/spaces/create-space-modal.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/spaces/create-space-modal.tsx), modificar la construcción del objeto `spaceData` (línea 96) para inyectar la propiedad `facetId` si es proporcionada.
*   - [x] **Tarea 2.3**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx), importar `CreateSpaceModal`.
*   - [x] **Tarea 2.4**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx), añadir el estado local `const [showCreateModal, setShowCreateModal] = useState(false)` y asociar la tarjeta dashed de creación (`onClick={() => setShowCreateModal(true)}`).
*   - [x] **Tarea 2.5**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx), renderizar al final del componente la modal de creación de espacios con los props adecuados.

#### **Fase 3: Integración del Drag-and-Drop y Reorganización Interactiva**
*   - [x] **Tarea 3.1**: Instalar la librería `@hello-pangea/dnd` ejecutando la instalación en la terminal.
*   - [x] **Tarea 3.2**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx), importar los componentes `DragDropContext`, `Droppable` y `Draggable` de `@hello-pangea/dnd`.
*   - [x] **Tarea 3.3**: En [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx), crear el estado reactivo `localSpaces` y sincronizarlo recursivamente con el prop `spaces` utilizando un `useEffect` para reaccionar ante cambios globales o de faceta activa.
*   - [x] **Tarea 3.4**: Envolver la cuadrícula CSS de renderizado con los contextos de arrastre. Estructurar el grid responsivo y mapear las tarjetas de espacios en elementos `<Draggable>` individuales y seguros.
*   - [x] **Tarea 3.5**: Codificar el manejador `handleDragEnd` para lograr la reorganización de Optimistic UI e implementar el bloque Try-Catch para rollback en caso de fallas de la API, alertando al usuario mediante toasts premium.

---

### 3. Contrato de Planificación (SDD Metadata)

*   **Change Topic Key**: `sdd/living-spaces-integration/tasks`
