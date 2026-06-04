# Spec-Driven Development: Especificación de Requisitos (Specifications)
## Cambio: living-spaces-integration

**Estado**: ESPECIFICADO (SPECIFIED)
**Fecha**: 2026-06-02
**Autor**: Antigravity (AI Senior Architect)

---

### 1. Criterios de Aceptación (Acceptance Criteria)

#### **Fase 1: Creación de Espacios Vinculados**
*   **CA 1.1 - Disparador del Modal**: Al hacer clic en la tarjeta dashed "Crear nuevo Espacio", se debe abrir el modal de creación de espacios (`CreateSpaceModal`).
*   **CA 1.2 - Asociación de la Faceta**: El modal de creación de espacios debe recibir de forma implícita el identificador de la faceta activa (`activeFacet.id`).
*   **CA 1.3 - Payload Correcto**: Al enviar el formulario de creación, la llamada `apiService.createSpace` debe incluir la faceta activa como autor de la identidad de ese espacio.
*   **CA 1.4 - Actualización Reactiva**: Tras crear el espacio con éxito, el modal debe cerrarse, mostrarse un toast de éxito, y la sección de "Espacios Vivos" del perfil debe recargarse automáticamente sin requerir F5.

#### **Fase 2: Drag-and-Drop e Interactividad**
*   **CA 2.1 - Estructura DND**: La lista de espacios vivos del perfil debe estar envuelta en los componentes `DragDropContext`, `Droppable` y `Draggable` de `@hello-pangea/dnd` utilizando la cuadrícula de visualización responsiva.
*   **CA 2.2 - Control de Interacción**: 
    *   Soportar interacciones fluidas tanto con ratón en escritorio como con gestos táctiles (touch) en dispositivos móviles.
    *   Durante el arrastre, la tarjeta seleccionada debe mostrar una sombra premium tridimensional, rotación sutil y cambio de opacidad para reflejar el estado activo.
*   **CA 2.3 - Indicador Visual**: El botón de "Arrastra para reorganizar" debe actuar como indicador o alternador visual, dando retroalimentación clara de que el ordenamiento está activo y funcional.

#### **Fase 3: Persistencia del Orden (Optimistic UI)**
*   **CA 3.1 - Actualización Optimista**: Al soltar una tarjeta en una nueva posición, el estado local de espacios vivos (`spaces`) debe reordenarse instantáneamente en pantalla antes de que finalice la llamada de red.
*   **CA 3.2 - Persistencia Asíncrona**: Enviar la secuencia ordenada de IDs de espacios (`[id1, id2, id3]`) al endpoint de red correspondiente para guardar de forma duradera la configuración.
*   **CA 3.3 - Recuperación ante Errores**: Si la API del backend reporta un fallo de conexión o error en el guardado del orden, la UI del perfil debe alertar al usuario y revertir la cuadrícula automáticamente al orden de origen para evitar incoherencias.

---

### 2. Escenarios de Comportamiento (Behavioral Scenarios)

#### **Escenario 1: Lanzamiento de creación interactiva vinculada**
```gherkin
Dado que un usuario con perfil "Artista Digital" (faceta activa) está en su perfil de Lumora
Cuando hace clic en la tarjeta dashed "Crear nuevo Espacio"
Entonces se debe abrir el modal "Crear Nuevo Espacio"
Y el formulario de creación debe asociarse de forma interna a la faceta activa
```

#### **Escenario 2: Creación exitosa y actualización inmediata**
```gherkin
Dado que el modal de creación de espacio está abierto y completado con el nombre "Galería de Óleos"
Cuando el usuario hace clic en "Crear Espacio"
Entonces se debe enviar el payload al endpoint POST /spaces incorporando la faceta activa
Y la API debe responder con código 201 de éxito
Y se debe cerrar el modal automáticamente
Y se debe mostrar un toast premium indicando "¡Espacio creado exitosamente!"
Y la cuadrícula de "Espacios Vivos" del perfil debe renderizar inmediatamente el nuevo espacio "Galería de Óleos"
```

#### **Escenario 3: Reorganización Drag-and-Drop exitosa (Optimistic UI)**
```gherkin
Dado que el usuario visualiza tres espacios vivos ordenados como: [Espacio A, Espacio B, Espacio C]
Cuando arrastra la tarjeta de "Espacio C" y la suelta en la primera posición
Entonces la pantalla debe reordenar instantáneamente las tarjetas como: [Espacio C, Espacio A, Espacio B]
Y se debe despachar una petición PUT /spaces/reorder enviando la secuencia de IDs correspondientes
Y al recibir la confirmación exitosa de la API, se debe mantener el orden activo
```

#### **Escenario 4: Manejo de errores durante la reorganización DND**
```gherkin
Dado que el usuario visualiza tres espacios ordenados como: [Espacio A, Espacio B, Espacio C]
Cuando arrastra "Espacio C" a la primera posición y se interrumpe la conexión a internet
Entonces la pantalla ordena localmente [Espacio C, Espacio A, Espacio B]
Y despacha la petición de red que finaliza en timeout o error
Y la interfaz detecta el error de guardado
Y se muestra un toast destructivo de error "No se pudo guardar el orden. Comprueba tu conexión."
Y la cuadrícula de espacios del perfil revierte las posiciones de inmediato al estado original: [Espacio A, Espacio B, Espacio C]
```

---

### 3. Contrato de Planificación (SDD Metadata)

*   **Change Topic Key**: `sdd/living-spaces-integration/spec`
