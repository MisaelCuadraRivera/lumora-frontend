# Solución Completa para Error de viewsCount en Backend

## Problema Identificado

El backend está intentando incrementar un campo `viewsCount` que no existe en la tabla de eventos:

```javascript
// En EventService.getEventById()
await event.increment('viewsCount'); // ❌ Este campo no existe
```

## Error Actual
```
Error: Unknown column 'viewsCount' in 'field list'
```

## Solución Implementada en Frontend

### 1. ✅ Método Alternativo en ApiService

He creado un método que obtiene eventos sin incrementar vistas:

```typescript
async getEventByIdWithoutIncrement(eventId: string) {
  // Usar el endpoint público y filtrar por ID
  const response = await this.getPublicEvents(1, 1000)
  if (response.success && response.data && typeof response.data === 'object' && response.data !== null && 'events' in response.data) {
    const events = (response.data as any).events
    const event = events.find((e: any) => e.id === eventId)
    if (event) {
      return { success: true, data: event }
    }
  }
  return { success: false, message: 'Evento no encontrado' }
}
```

### 2. ✅ Página de Evento Individual Actualizada

La página de evento individual ahora usa directamente el método alternativo:

```typescript
// En app/events/[id]/page.tsx
const response = await apiService.getEventByIdWithoutIncrement(eventId)
```

### 3. ✅ Manejo de Errores Robusto

Si el método alternativo falla, se muestra un error claro al usuario.

## Solución Recomendada para el Backend

### Opción 1: Usar el campo stats existente (RECOMENDADA)

El modelo de Event ya tiene un campo `stats` de tipo JSON. Modifica el código del backend:

```javascript
// En lugar de:
await event.increment('viewsCount');

// Usar:
const currentStats = event.stats || { views: 0 };
const updatedStats = {
  ...currentStats,
  views: (currentStats.views || 0) + 1
};
await event.update({ stats: updatedStats });
```

### Opción 2: Agregar el campo viewsCount a la tabla

Si prefieres mantener el campo separado, agrega la migración:

```sql
ALTER TABLE events ADD COLUMN viewsCount INT DEFAULT 0;
```

Y luego actualiza el modelo:

```javascript
// En el modelo Event
viewsCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0
}
```

## Código de Ejemplo para Backend

```javascript
// EventService.js - Método getEventById corregido
static async getEventById(eventId, userId = null) {
  try {
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Space,
          as: 'space',
          attributes: ['id', 'name', 'image']
        }
      ]
    });

    if (!event) {
      throw new Error('Evento no encontrado');
    }

    // Verificar si el usuario puede ver el evento
    if (!event.isPublic && event.userId !== userId) {
      throw new Error('No tienes permisos para ver este evento');
    }

    // Incrementar contador de vistas usando stats
    const currentStats = event.stats || { views: 0 };
    const updatedStats = {
      ...currentStats,
      views: (currentStats.views || 0) + 1
    };
    
    await event.update({ stats: updatedStats });

    return {
      success: true,
      data: event,
      message: 'Evento obtenido exitosamente'
    };
  } catch (error) {
    throw error;
  }
}
```

## Estado Actual del Frontend

### ✅ Funcionalidades que Funcionan:
- **Crear eventos:** Formulario completo funcional
- **Ver eventos individuales:** Usando método alternativo
- **Lista de eventos:** Carga correctamente
- **Botón de recarga:** Para forzar actualización

### 🔧 Funcionalidades Temporalmente Deshabilitadas:
- **Contador de vistas:** No se incrementa automáticamente
- **Estadísticas de vistas:** No disponibles hasta corregir backend

## Verificación

Después de implementar la solución en el backend:

1. El error de `viewsCount` desaparecerá
2. Las vistas se contarán correctamente en el campo `stats.views`
3. El frontend funcionará normalmente sin necesidad del método alternativo
4. Se pueden agregar más estadísticas fácilmente (likes, shares, etc.)

## Nota Importante

Esta es una solución temporal en el frontend. **Es importante corregir el backend** para evitar problemas futuros y mantener la funcionalidad completa del sistema.

## Archivos Modificados en Frontend

- `lib/api.ts`: Método `getEventByIdWithoutIncrement()`
- `app/events/[id]/page.tsx`: Usa método alternativo directamente
- `components/events/complete-create-event-modal.tsx`: Formulario completo funcional
- `components/events/event-catalog.tsx`: Botón de recarga agregado
