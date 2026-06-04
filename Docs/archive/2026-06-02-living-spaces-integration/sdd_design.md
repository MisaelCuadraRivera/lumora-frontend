# Spec-Driven Development: Diseño Técnico (Technical Design)
## Cambio: living-spaces-integration

**Estado**: DISEÑADO (DESIGNED)
**Fecha**: 2026-06-02
**Autor**: Antigravity (AI Senior Architect)

---

### 1. Mapa de Modificación de Archivos (File Modification Map)

Modificaremos los siguientes archivos clave de la aplicación de manera limpia, atómica y desacoplada:

```
[lib/api.ts] (Añadir endpoint de ordenamiento)
    └── [hooks/useSpaces.ts] (Exponer método de reordenación en el hook)
         └── [components/profile/living-spaces.tsx] (Implementar Drag-and-Drop y modal)
```

#### A. [`lib/api.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/lib/api.ts)
*   Añadir un método `updateSpacesOrder(orderedIds: string[])` para despachar el nuevo orden de los espacios al backend en `/spaces/reorder`.
*   Asegurar que la interfaz de creación y llamadas de espacios admita parámetros dinámicos de facetas.

#### B. [`hooks/useSpaces.ts`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/hooks/useSpaces.ts)
*   Añadir un método asíncrono `updateSpacesOrder(orderedIds: string[])` al retorno del hook `useSpaces`.
*   Implementar la llamada al endpoint de la API y manejar la sincronización del estado local `spaces` en caso de fallos (rollback state).

#### C. [`components/profile/living-spaces.tsx`](file:///Users/albertovazquez/Documents/lumora-project/lumora-frontend/components/profile/living-spaces.tsx)
*   Importar `@hello-pangea/dnd` para envolver la cuadrícula responsiva de espacios vivos.
*   Importar `CreateSpaceModal` desde `@/components/spaces/create-space-modal`.
*   Añadir un estado local `localSpaces` sincronizado mediante `useEffect` con el prop `spaces` para habilitar **Optimistic UI**.
*   Añadir un estado `showCreateModal` (boolean) y vincular la tarjeta dashed de creación mediante `onClick`.
*   Implementar la función `handleDragEnd` para reordenar las tarjetas de inmediato y despachar la actualización al backend en segundo plano.

---

### 2. Flujo de Datos e Integración del Drag-and-Drop (DND Architecture)

Utilizaremos `@hello-pangea/dnd` para lograr animaciones fluidas y soporte táctil 100% compatible con React 18/19 y modo estricto de Next.js.

#### A. Árbol de Componentes del Reordenamiento
```tsx
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="spaces-grid" direction="horizontal" type="GRID">
    {(provided) => (
      <div 
        ref={provided.innerRef} 
        {...provided.droppableProps}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {localSpaces.map((space, index) => (
          <Draggable key={space.id} draggableId={space.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={provided.draggableProps.style}
                className={cn(
                  "transition-all duration-200",
                  snapshot.isDragging && "scale-105 rotate-1 shadow-2xl z-50 ring-2 ring-primary/30 bg-card"
                )}
              >
                <Card>...</Card>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
        
        {/* Tarjeta de Creación Estática al Final */}
        <Card onClick={() => setShowCreateModal(true)}>...</Card>
      </div>
    )}
  </Droppable>
</DragDropContext>
```

#### B. Algoritmo de Reordenamiento Optimista y Reversión (Rollback Pattern)
```typescript
const handleDragEnd = async (result: any) => {
  if (!result.destination) return
  
  const items = Array.from(localSpaces)
  const [reorderedItem] = items.splice(result.source.index, 1)
  items.splice(result.destination.index, 0, reorderedItem)
  
  // 1. Optimistic Update (Actualización Inmediata en Pantalla)
  const previousState = [...localSpaces]
  setLocalSpaces(items)
  
  // 2. Persistir en Servidor
  try {
    const orderedIds = items.map(s => s.id)
    const res = await updateSpacesOrder(orderedIds)
    if (!res.success) {
      throw new Error(res.message || "Error al guardar el nuevo orden")
    }
    toast.success("Orden de espacios guardado")
  } catch (error: any) {
    // 3. Rollback (Revertir al estado original ante fallos)
    setLocalSpaces(previousState)
    toast.error(error.message || "Error de conexión, restableciendo orden original")
  }
}
```

---

### 3. Modificaciones en el Formulario de Creación (Facet Binding payload)

Para asegurar la vinculación con la faceta activa del usuario, modificaremos la llamada del modal de creación en `living-spaces.tsx` inyectando la faceta activa:

```typescript
<CreateSpaceModal 
  isOpen={showCreateModal} 
  onClose={() => setShowCreateModal(false)}
  facetId={activeFacetId}
  onSuccess={refreshSpaces}
/>
```
*(Nota: Modificaremos `CreateSpaceModal` para que acepte opcionalmente la prop `facetId` y la inyecte de forma transparente en el payload `spaceData` enviado a `createSpace`).*

---

### 4. Riesgos y Mitigaciones (Risks & Mitigations)

*   **Gotcha de Colisiones de Z-Index**: Durante el arrastre, las tarjetas DND pueden quedar ocultas por debajo de otros elementos absolutos del perfil o del Sidebar.
    *   *Mitigación*: Añadir clases `z-50 shadow-2xl` y una sutil rotación en el estado de arrastre (`snapshot.isDragging`) mediante estilos condicionales Tailwind.
*   **Gotcha de Desincronización de Props**: Si el usuario cambia de faceta desde la barra lateral, el prop `spaces` cambia, pero el estado local `localSpaces` podría quedar desfasado.
    *   *Mitigación*: Implementar un `useEffect` que observe el prop `spaces` y re-sincronice el estado local de inmediato ante cambios de identidad.

---

### 5. Contrato de Planificación (SDD Metadata)

*   **Change Topic Key**: `sdd/living-spaces-integration/design`
