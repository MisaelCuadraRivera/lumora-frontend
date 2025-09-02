# 🌌 Lumora Social

> **Explora todas tus versiones. Crea espacios donde todo es posible.**

Lumora es una red social modular y colaborativa que rompe las limitaciones tradicionales de las plataformas sociales. Permite a cada usuario explorar múltiples identidades (facetas), crear espacios digitales totalmente personalizables y participar en experiencias únicas.

## ✨ Características Principales

### 🎭 **Multiperfil (Identidades Múltiples)**
- **Facetas personalizables**: Crea diferentes personalidades dentro de un mismo perfil
- **Control de visibilidad**: Elige quién ve cada faceta (pública, amigos, privada, grupos específicos)
- **Perfiles tipo tablero**: Organiza contenido por categorías (posts, música, notas, favoritos)

### 🏛️ **Espacios Vivos**
- **Comunidades dinámicas**: Más sociales que Discord, más visuales que Notion
- **Módulos personalizables**: Chat, posts, eventos, marketplace, tareas, multimedia
- **Tipos de espacios**: Comunidades, diarios, tiendas, clubs de fans, proyectos colaborativos

### 🛠️ **Modularidad Total**
- **Funciones personalizables**: El usuario decide qué activar
- **Feed cruzado inteligente**: Mezcla de diferentes facetas y comunidades
- **Herramientas Pro**: IA, marketplace, eventos, analytics avanzados

## 🚀 Tecnologías Principales

- **Next.js 15** - Framework React moderno con App Router
- **React 19** - Librería base de UI con las últimas características
- **TypeScript** - Tipado estático para mayor seguridad
- **Tailwind CSS 4** - Estilos rápidos y responsivos
- **Shadcn/UI** - Componentes accesibles y modernos
- **Framer Motion** - Animaciones fluidas y profesionales
- **TipTap** - Editor de texto rico (WYSIWYG)
- **Lucide React** - Iconografía elegante y ligera
- **Date-fns** - Manipulación de fechas
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** v18 o superior
- **npm** v10 o superior (o pnpm/yarn)

## 📥 Instalación

1. **Clona este repositorio:**
```bash
git clone https://github.com/tu-usuario/lumora-social.git
cd lumora-social
```

2. **Instala las dependencias:**
```bash
npm install --legacy-peer-deps
```

> **Nota**: Usamos `--legacy-peer-deps` por compatibilidad con React 19 y las dependencias actuales.

## ▶️ Desarrollo

**Inicia el servidor en modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en:
- **Local**: http://localhost:3000
- **Red**: http://192.168.1.74:3000

## 🏗️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el entorno de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta el linter de código |

## 📦 Estructura del Proyecto

```
lumora-social/
├── app/                    # App Router de Next.js
│   ├── events/             # Página de eventos
│   ├── feed/               # Feed principal
│   ├── login/              # Página de login
│   ├── marketplace/        # Marketplace
│   ├── notifications/      # Notificaciones
│   ├── profile/            # Perfil de usuario
│   ├── settings/           # Configuración
│   └── spaces/             # Espacios y chat
├── components/             # Componentes reutilizables
│   ├── chat/              # Componentes de chat
│   ├── events/            # Componentes de eventos
│   ├── layout/            # Layout principal
│   ├── marketplace/       # Componentes del marketplace
│   ├── posts/             # Componentes de posts
│   ├── profile/           # Componentes de perfil
│   ├── spaces/            # Componentes de espacios
│   └── ui/                # Componentes UI base (Shadcn)
├── data/                  # Datos mock y utilidades
│   ├── events.ts          # Datos de eventos
│   ├── marketplace.ts     # Datos del marketplace
│   ├── posts.ts           # Datos de posts
│   ├── spaces.ts          # Datos de espacios
│   └── users.ts           # Datos de usuarios
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilidades y configuración
├── public/                # Assets estáticos
├── styles/                # Estilos globales
└── types/                 # Definiciones de TypeScript
```

## 🎯 Módulos Implementados

### ✅ **Completados**
- **🏠 Feed Principal** - Feed cruzado inteligente con algoritmos personalizables
- **👤 Sistema de Facetas** - Multiperfil completo con gestión avanzada
- **🏛️ Espacios** - Creación y gestión de espacios modulares
- **💬 Chat en Tiempo Real** - Sistema de mensajería completo
- **🛒 Marketplace** - Catálogo de productos con filtros avanzados
- **🎫 Eventos** - Sistema completo de eventos con calendario interactivo
- **🔔 Notificaciones** - Sistema de notificaciones en tiempo real
- **⚙️ Configuración** - Panel de configuración personalizable

### 🚧 **En Desarrollo**
- **🎥 Streaming Integrado** - Transmisiones en vivo dentro de espacios
- **📊 Analytics Avanzados** - Dashboard Pro con métricas detalladas
- **🤖 IA Integrada** - Asistentes y generación de contenido
- **💳 Sistema de Pagos** - Integración con Stripe/PayPal

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase (para futuras integraciones)
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima

# Stripe (para pagos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-clave-publica-stripe
STRIPE_SECRET_KEY=tu-clave-secreta-stripe

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=tu-id-analytics
```

## 🎨 Temas y Personalización

Lumora incluye un sistema de temas completo:

- **🌙 Modo Oscuro** - Activado por defecto
- **☀️ Modo Claro** - Disponible en configuración
- **🎨 Temas Personalizados** - Colores personalizables por espacio
- **📱 Responsive Design** - Optimizado para móvil y desktop

## 🤝 Contribución

1. **Haz un fork** del repositorio
2. **Crea una nueva rama**: `git checkout -b feature/nueva-funcionalidad`
3. **Realiza tus cambios** y haz commit: `git commit -m "Agrego nueva funcionalidad"`
4. **Haz push** a tu rama: `git push origin feature/nueva-funcionalidad`
5. **Abre un Pull Request** 🚀

### 📋 Guías de Contribución

- **Código**: Sigue las convenciones de TypeScript y ESLint
- **Componentes**: Usa Shadcn/UI como base, mantén consistencia
- **Testing**: Agrega tests para nuevas funcionalidades
- **Documentación**: Actualiza la documentación cuando sea necesario

## 📊 Estado del Proyecto

- **MVP**: ✅ Completado
- **Comunidad**: +19,000 seguidores orgánicos en Instagram
- **Lanzamiento**: Q3 2025 (planeado)
- **Valuación**: $950,000 USD
- **Inversión**: Buscando $100,000 USD (5-15% equity)

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Eres libre de usar, modificar y distribuir, siempre dando crédito a Lumora.

## 🌟 Agradecimientos

- **Comunidad Lumora** - Por el feedback constante
- **Contribuidores** - Por hacer este proyecto posible
- **Tecnologías Open Source** - Por proporcionar las herramientas necesarias

## 📞 Contacto

- **Website**: [lumora.com](https://lumoraweb.site/)
- **Instagram**: [@lumora.social](https://www.instagram.com/lumora_web/)
- **Email**: misael.cuadra@lumoraweb.site

---

<div align="center">

**✨ Slogan oficial:**
> "Explora todas tus versiones. Crea espacios donde todo es posible."

*Construido con ❤️ por el equipo de Lumora*

</div>
