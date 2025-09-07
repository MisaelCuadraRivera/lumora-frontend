# Solución para Error de viewsCount en Backend

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

## Solución Recomendada

### Opción 1: Usar el campo stats existente

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

## Implementación Temporal en Frontend

He implementado una solución temporal en el frontend que:

1. **Detecta el error** de viewsCount automáticamente
2. **Usa un método alternativo** que obtiene el evento desde la lista pública
3. **Muestra una notificación** al usuario sobre el problema
4. **Continúa funcionando** sin interrupciones

## Archivos Modificados

- `lib/api.ts`: Método `getEventByIdWithoutIncrement()`
- `app/events/[id]/page.tsx`: Manejo de errores con fallback

## Recomendación Final

**Usa la Opción 1** (campo stats) ya que es más flexible y permite agregar más estadísticas en el futuro sin modificar la estructura de la tabla.

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

## Verificación

Después de implementar la solución en el backend:

1. El error de `viewsCount` desaparecerá
2. Las vistas se contarán correctamente en el campo `stats.views`
3. El frontend funcionará normalmente sin necesidad del método alternativo
4. Se pueden agregar más estadísticas fácilmente (likes, shares, etc.)

## Nota Importante

Esta es una solución temporal en el frontend. **Es importante corregir el backend** para evitar problemas futuros y mantener la funcionalidad completa del sistema.
