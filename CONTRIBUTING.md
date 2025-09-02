# 🤝 Guía de Contribución - Lumora Social

¡Gracias por tu interés en contribuir a Lumora! Este documento te guiará a través del proceso de contribución.

## 📋 Índice

- [Código de Conducta](#código-de-conducta)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Contribución](#proceso-de-contribución)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Reporte de Bugs](#reporte-de-bugs)
- [Solicitud de Funcionalidades](#solicitud-de-funcionalidades)

## 📜 Código de Conducta

Al participar en este proyecto, aceptas seguir nuestro [Código de Conducta](CODE_OF_CONDUCT.md). En resumen:

- **Sé respetuoso** con todos los contribuidores
- **Mantén un ambiente inclusivo** y acogedor
- **Usa lenguaje apropiado** en todos los canales de comunicación
- **Reporta comportamientos inapropiados** a los mantenedores

## ⚙️ Configuración del Entorno

### Requisitos Previos

- Node.js v18 o superior
- npm v10 o superior
- Git

### Configuración Local

1. **Fork del repositorio**
```bash
git clone https://github.com/tu-usuario/lumora-social.git
cd lumora-social
```

2. **Instala dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configura variables de entorno**
```bash
cp env.example .env.local
# Edita .env.local con tus credenciales
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

## 🔄 Proceso de Contribución

### 1. **Crear una Issue**

Antes de empezar a codificar:

- **Bugs**: Usa la plantilla de "Bug Report"
- **Funcionalidades**: Usa la plantilla de "Feature Request"
- **Mejoras**: Usa la plantilla de "Enhancement"

### 2. **Crear una Rama**

```bash
git checkout -b feature/nombre-de-la-funcionalidad
# o
git checkout -b fix/nombre-del-bug
```

**Convenciones de nombres:**
- `feature/` - Nuevas funcionalidades
- `fix/` - Correcciones de bugs
- `docs/` - Documentación
- `refactor/` - Refactorización de código
- `test/` - Tests

### 3. **Desarrollo**

- **Sigue las guías de desarrollo** (ver sección siguiente)
- **Escribe tests** para nuevas funcionalidades
- **Actualiza documentación** cuando sea necesario
- **Mantén commits pequeños** y descriptivos

### 4. **Testing**

```bash
# Linter
npm run lint

# Build
npm run build

# Tests (cuando estén implementados)
npm run test
```

### 5. **Commit y Push**

```bash
git add .
git commit -m "feat: agrega nueva funcionalidad de marketplace

- Implementa catálogo de productos
- Agrega filtros avanzados
- Incluye sistema de carrito
- Resuelve #123"
```

**Convenciones de commits:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formato de código
- `refactor:` - Refactorización
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

### 6. **Pull Request**

1. **Crea el PR** desde tu rama hacia `main`
2. **Usa la plantilla** de Pull Request
3. **Describe los cambios** detalladamente
4. **Menciona issues relacionadas** con `Closes #123`
5. **Espera review** de los mantenedores

## 🛠️ Guías de Desarrollo

### Estructura de Archivos

```
components/
├── ui/           # Componentes base (Shadcn/UI)
├── layout/       # Layouts principales
├── [module]/     # Componentes específicos por módulo
└── shared/       # Componentes compartidos
```

### Convenciones de Código

#### TypeScript
- **Usa tipos estrictos** - evita `any`
- **Define interfaces** para props de componentes
- **Usa enums** para valores constantes
- **Documenta tipos complejos**

```typescript
interface UserCardProps {
  user: User
  showActions?: boolean
  onAction?: (action: UserAction) => void
}

enum UserAction {
  FOLLOW = 'follow',
  MESSAGE = 'message',
  BLOCK = 'block'
}
```

#### React/Next.js
- **Usa hooks personalizados** para lógica reutilizable
- **Implementa lazy loading** para componentes pesados
- **Optimiza imágenes** con `next/image`
- **Usa Server Components** cuando sea posible

```typescript
// ✅ Bueno
const UserCard = ({ user, showActions = true }: UserCardProps) => {
  const { followUser, isFollowing } = useFollowUser(user.id)
  
  return (
    <Card>
      <CardContent>
        <Avatar src={user.avatar} alt={user.name} />
        <h3>{user.name}</h3>
        {showActions && (
          <Button onClick={() => followUser()}>
            {isFollowing ? 'Dejar de seguir' : 'Seguir'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

#### Styling (Tailwind CSS)
- **Usa clases utilitarias** de Tailwind
- **Crea componentes** para patrones repetitivos
- **Mantén consistencia** en espaciado y colores
- **Usa variables CSS** para temas

```typescript
// ✅ Bueno
const Button = ({ variant = 'default', children }: ButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors"
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-background hover:bg-accent",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}
```

### Componentes

#### Estructura de Componente
```typescript
"use client" // Solo si necesitas interactividad

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import type { ComponentProps } from "@/types"

interface ComponentProps {
  // Props aquí
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks aquí
  const [state, setState] = useState()
  
  // Effects aquí
  useEffect(() => {
    // Lógica aquí
  }, [])
  
  // Handlers aquí
  const handleClick = () => {
    // Lógica aquí
  }
  
  // Render aquí
  return (
    <div>
      {/* JSX aquí */}
    </div>
  )
}
```

#### Naming Conventions
- **Componentes**: PascalCase (`UserCard`, `EventCalendar`)
- **Archivos**: kebab-case (`user-card.tsx`, `event-calendar.tsx`)
- **Hooks**: camelCase con `use` (`useAuth`, `useFollowUser`)
- **Utilidades**: camelCase (`formatDate`, `validateEmail`)

### Testing

#### Estructura de Tests
```typescript
// __tests__/components/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import { UserCard } from '@/components/UserCard'

describe('UserCard', () => {
  it('should render user information correctly', () => {
    const user = { id: '1', name: 'John Doe', avatar: '/avatar.jpg' }
    
    render(<UserCard user={user} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', '/avatar.jpg')
  })
  
  it('should call onAction when button is clicked', () => {
    const onAction = jest.fn()
    const user = { id: '1', name: 'John Doe' }
    
    render(<UserCard user={user} onAction={onAction} />)
    
    screen.getByRole('button').click()
    
    expect(onAction).toHaveBeenCalledWith('follow')
  })
})
```

## 🐛 Reporte de Bugs

### Antes de Reportar

1. **Busca en issues existentes** - puede que ya esté reportado
2. **Reproduce el bug** en la última versión
3. **Verifica en diferentes navegadores** si es relevante

### Plantilla de Bug Report

```markdown
## 🐛 Descripción del Bug

Descripción clara y concisa del bug.

## 🔄 Pasos para Reproducir

1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hasta '...'
4. Ve el error

## ✅ Comportamiento Esperado

Descripción de lo que debería pasar.

## 📱 Información Adicional

- **Navegador**: Chrome 120.0.6099.109
- **Sistema Operativo**: macOS 14.1
- **Versión de Node**: 18.17.0

## 📸 Capturas de Pantalla

Si aplica, agrega capturas de pantalla.

## 🔗 Enlaces Relacionados

- Issue relacionada: #123
- Documentación: [link]
```

## 💡 Solicitud de Funcionalidades

### Antes de Solicitar

1. **Busca en issues existentes** - puede que ya esté planeado
2. **Verifica la roadmap** del proyecto
3. **Considera el impacto** en la arquitectura

### Plantilla de Feature Request

```markdown
## 💡 Descripción de la Funcionalidad

Descripción clara de la funcionalidad que te gustaría ver.

## 🎯 Caso de Uso

Explica cómo esta funcionalidad resolvería un problema o mejoraría la experiencia.

## 🔧 Propuesta de Implementación

Si tienes ideas sobre cómo implementarlo, compártelas aquí.

## 📋 Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## 📱 Mockups/Wireframes

Si tienes diseños, agrégalos aquí.

## 🔗 Enlaces Relacionados

- Issue relacionada: #123
- Documentación: [link]
```

## 🏷️ Etiquetas de Issues

### Para Bugs
- `bug` - Error en el código
- `high-priority` - Bug crítico
- `low-priority` - Bug menor
- `browser-specific` - Solo en ciertos navegadores

### Para Funcionalidades
- `enhancement` - Mejora de funcionalidad existente
- `feature` - Nueva funcionalidad
- `good-first-issue` - Ideal para principiantes
- `help-wanted` - Necesita ayuda

### Para Documentación
- `documentation` - Mejoras en docs
- `docs` - Documentación faltante

## 🎉 Reconocimiento

Los contribuidores serán reconocidos en:

- **README.md** - Lista de contribuidores
- **Releases** - Notas de lanzamiento
- **Documentación** - Guías y ejemplos

## 📞 Contacto

Si tienes preguntas sobre contribución:

- **Discord**: [Lumora Community](https://discord.gg/lumora)
- **Email**: contributors@lumora.com
- **Twitter**: [@lumora_social](https://twitter.com/lumora_social)

---

**¡Gracias por hacer Lumora mejor! 🌟**
