# 🔗 Conexión Frontend-Backend - Lumora Social

## 📋 Pasos para Conectar Frontend con Backend

### 1. **Configurar Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto frontend:

```bash
# Configuración local para desarrollo
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

### 2. **Iniciar el Backend**

En la terminal del backend (`lumora-backend`):

```bash
# Instalar dependencias
npm install

# Crear archivo .env con configuración de base de datos
cp env.example .env

# Editar .env con tus credenciales MySQL
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=lumora_db
# DB_USER=root
# DB_PASSWORD=tu_password
# JWT_SECRET=tu-super-secret-jwt-key

# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE lumora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# Iniciar servidor backend
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

### 3. **Iniciar el Frontend**

En la terminal del frontend (`lumora-social`):

```bash
# El frontend ya está configurado
npm run dev
```

El frontend estará disponible en: `http://localhost:3000` (o el puerto disponible)

### 4. **Probar la Conexión**

#### **Registro de Usuario:**
1. Ve a `/login`
2. Cambia a "Regístrate"
3. Completa todos los campos:
   - Email
   - Nombre
   - Apellido
   - Usuario
   - Contraseña
4. Haz clic en "Crear Cuenta"

#### **Login de Usuario:**
1. Cambia a "Inicia sesión"
2. Usa las credenciales del usuario registrado
3. Haz clic en "Iniciar Sesión"

### 5. **Verificar Funcionamiento**

#### **En el Frontend:**
- ✅ Login/registro funciona
- ✅ Usuario se guarda en localStorage
- ✅ Token JWT se almacena
- ✅ Redirección a página principal

#### **En el Backend:**
- ✅ Usuario creado en base de datos
- ✅ Faceta por defecto creada
- ✅ Token JWT generado
- ✅ Respuesta JSON correcta

### 6. **Endpoints Disponibles**

#### **Autenticación:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `GET /api/auth/verify` - Verificar token

#### **Posts:**
- `GET /api/posts/feed` - Feed principal
- `POST /api/posts` - Crear post
- `GET /api/posts/:id` - Obtener post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post
- `POST /api/posts/:id/like` - Like/unlike

### 7. **Hooks Disponibles**

#### **useAuth()** - Autenticación
```typescript
const { user, login, register, logout, loading, refreshUser } = useAuth()
```

#### **usePosts()** - Gestión de Posts
```typescript
const { 
  posts, 
  loading, 
  error, 
  hasMore, 
  loadMore, 
  createPost, 
  updatePost, 
  deletePost, 
  toggleLike 
} = usePosts()
```

#### **useFacets()** - Gestión de Facetas
```typescript
const { 
  facets, 
  activeFacet, 
  createFacet, 
  updateFacet, 
  deleteFacet, 
  toggleFacet 
} = useFacets()
```

#### **useSpaces()** - Gestión de Espacios
```typescript
const { 
  spaces, 
  createSpace, 
  updateSpace, 
  joinSpace, 
  leaveSpace 
} = useSpaces()
```

### 8. **Servicio API**

El servicio `apiService` está disponible globalmente:

```typescript
import { apiService } from '@/lib/api'

// Ejemplos de uso
await apiService.login(email, password)
await apiService.createPost(postData)
await apiService.getSpaces()
await apiService.createFacet(facetData)
```

### 9. **Manejo de Errores**

El sistema maneja errores de forma consistente:

```typescript
// En hooks
const { error } = usePosts()

// En componentes
const result = await login(email, password)
if (!result.success) {
  setErrorMessage(result.message)
}
```

### 10. **Próximos Pasos**

1. **Implementar más endpoints** en el backend
2. **Conectar componentes** del frontend con hooks
3. **Agregar validaciones** adicionales
4. **Implementar WebSocket** para tiempo real
5. **Agregar tests** para la integración

### 🚨 **Solución de Problemas**

#### **Error de CORS:**
- Verificar que `ALLOWED_ORIGINS` en backend incluya el puerto del frontend

#### **Error de Conexión:**
- Verificar que el backend esté corriendo en puerto 3001
- Verificar que `NEXT_PUBLIC_API_URL` esté configurado correctamente

#### **Error de Base de Datos:**
- Verificar credenciales MySQL en `.env`
- Verificar que la base de datos `lumora_db` existe
- Verificar que Sequelize puede conectarse

#### **Error de Token:**
- Verificar que `JWT_SECRET` esté configurado
- Limpiar localStorage si hay tokens inválidos

---

**🌌 Lumora Social** - Frontend y Backend conectados exitosamente!


