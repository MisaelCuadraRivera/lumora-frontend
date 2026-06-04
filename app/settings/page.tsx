"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  Download,
  Upload,
  Key,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  Volume2,
  VolumeX,
  Mail,
  MessageSquare,
  Users,
  EyeIcon,
  Shield as ShieldIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  UserPlus
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL parameters as the single source of truth for tab state
  const activeTab = searchParams.get("tab") || "profile"
  
  const handleTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false })
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Account deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmDeleteText, setConfirmDeleteText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  })

  // Actualizar profileData y preferencias cuando user cambie
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      })

      // Sincronizar preferencias desde la base de datos si existen
      if (user.preferences) {
        if (user.preferences.notifications) {
          setNotificationSettings(prev => ({
            ...prev,
            ...user.preferences.notifications
          }))
        }
        if (user.preferences.privacy) {
          setPrivacySettings(prev => ({
            ...prev,
            ...user.preferences.privacy
          }))
        }
        if (user.preferences.appearance) {
          setAppearanceSettings(prev => ({
            ...prev,
            ...user.preferences.appearance
          }))

          // Sincronizar tema de apariencia en el documento HTML
          const theme = user.preferences.appearance.theme
          const body = document.documentElement
          if (theme === "dark") {
            body.classList.add("dark")
          } else if (theme === "light") {
            body.classList.remove("dark")
          } else if (theme === "auto") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            if (mediaQuery.matches) {
              body.classList.add("dark")
            } else {
              body.classList.remove("dark")
            }
          }
        }
      }
    }
  }, [user])

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    mentions: true,
    likes: true,
    comments: true,
    follows: true,
    spaceInvites: true,
    marketing: false,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showOnlineStatus: true,
    showFacets: true,
    allowMessages: "friends",
    allowMentions: "everyone",
    showActivity: true,
    dataCollection: true,
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    language: "es",
    fontSize: "medium",
    reduceMotion: false,
    highContrast: false,
  })

  // Escuchar cambios de tema del sistema operativo (prefers-color-scheme) de manera reactiva
  useEffect(() => {
    if (appearanceSettings.theme !== "auto") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleThemeSystemChange = (e: MediaQueryListEvent) => {
      const body = document.documentElement
      if (e.matches) {
        body.classList.add("dark")
      } else {
        body.classList.remove("dark")
      }
    }

    mediaQuery.addEventListener("change", handleThemeSystemChange)

    return () => {
      mediaQuery.removeEventListener("change", handleThemeSystemChange)
    }
  }, [appearanceSettings.theme])

  const handleSaveProfile = async () => {
    try {
      // Preparar los datos para enviar a la API
      const updateData: any = {}
      
      if (profileData.username !== user?.username) {
        updateData.username = profileData.username
      }
      if (profileData.email !== user?.email) {
        updateData.email = profileData.email
      }
      if (profileData.bio !== user?.bio) {
        updateData.bio = profileData.bio
      }
      if (profileData.avatar !== user?.avatar) {
        updateData.avatar = profileData.avatar
      }

      // Solo hacer la petición si hay cambios
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Sin cambios",
          description: "No hay cambios que guardar.",
          variant: "default",
        })
        return
      }

      console.log("Guardando perfil:", updateData)
      
      // Hacer la llamada a la API
      const response = await apiService.updateProfile(updateData)
      
      if (response.success) {
        toast({
          title: "Perfil actualizado",
          description: "Tus cambios han sido guardados exitosamente.",
          variant: "default",
        })
        
        // Actualizar el usuario en el contexto de autenticación
        await refreshUser()
      } else {
        throw new Error(response.message || "Error al actualizar el perfil")
      }
    } catch (error: any) {
      console.error("Error al guardar perfil:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos de contraseña.",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Contraseña muy corta",
        description: "La nueva contraseña debe tener al menos 8 caracteres.",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await apiService.changePassword(currentPassword, newPassword)
      if (response.success) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada exitosamente.",
          variant: "default",
        })
        setCurrentPassword("")
        setNewPassword("")
      } else {
        throw new Error(response.message || "Error al cambiar la contraseña")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await apiService.exportUserData()
      if (response.success) {
        toast({
          title: "Exportación iniciada",
          description: "Recibirás un email con tus datos en los próximos minutos.",
          variant: "default",
        })
      } else {
        throw new Error(response.message || "Error al exportar datos")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar la exportación de datos.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== "ELIMINAR") {
      toast({
        title: "Error de validación",
        description: "Por favor escribe exactamente 'ELIMINAR' para confirmar.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const response = await apiService.deleteAccount()
      if (response.success) {
        toast({
          title: "Cuenta eliminada",
          description: "Tu cuenta ha sido eliminada permanentemente.",
          variant: "destructive",
        })
        setShowDeleteModal(false)
        await logout()
        router.push("/login")
      } else {
        throw new Error(response.message || "Error al eliminar la cuenta")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleNotificationSettingsChange = async (key: string, value: boolean) => {
    const updated = { ...notificationSettings, [key]: value }
    setNotificationSettings(updated)
    
    try {
      const response = await apiService.updatePreferences({ notifications: updated })
      if (response.success) {
        toast({
          title: "Configuración actualizada",
          description: "Tus preferencias de notificaciones han sido guardadas.",
          variant: "default",
        })
        await refreshUser()
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración en la base de datos.",
        variant: "destructive"
      })
    }
  }

  const handlePrivacySettingsChange = async (key: string, value: string | boolean) => {
    const updated = { ...privacySettings, [key]: value }
    setPrivacySettings(updated)
    
    try {
      const response = await apiService.updatePreferences({ privacy: updated })
      if (response.success) {
        toast({
          title: "Privacidad actualizada",
          description: "Tus configuraciones de privacidad han sido guardadas.",
          variant: "default",
        })
        await refreshUser()
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración de privacidad.",
        variant: "destructive"
      })
    }
  }

  const handleAppearanceSettingsChange = async (key: string, value: string | boolean) => {
    const updated = { ...appearanceSettings, [key]: value }
    setAppearanceSettings(updated)
    
    try {
      const response = await apiService.updatePreferences({ appearance: updated })
      if (response.success) {
        if (key === "theme") {
          const body = document.documentElement
          if (value === "dark") {
            body.classList.add("dark")
          } else if (value === "light") {
            body.classList.remove("dark")
          } else if (value === "auto") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            if (mediaQuery.matches) {
              body.classList.add("dark")
            } else {
              body.classList.remove("dark")
            }
          }
        }
        toast({
          title: "Apariencia actualizada",
          description: "Tus configuraciones de apariencia han sido guardadas.",
          variant: "default",
        })
        await refreshUser()
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración de apariencia.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Configuración
          </h1>
          <p className="text-muted-foreground mt-1">
            Personaliza tu experiencia en Lumora
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Settings className="h-3 w-3" />
          Beta
        </Badge>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Settings className="h-4 w-4" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar || "/placeholder-user.jpg"} />
                  <AvatarFallback>
                    {profileData.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Cambiar Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG hasta 5MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="tu_usuario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleChangePassword} className="gap-2" disabled={isChangingPassword}>
                  {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencias de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones importantes por correo
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones en tiempo real en tu dispositivo
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("pushNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tipos de notificaciones</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Me gusta</span>
                    </div>
                    <Switch
                      checked={notificationSettings.likes}
                      onCheckedChange={(checked) => handleNotificationSettingsChange("likes", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span>Comentarios</span>
                    </div>
                    <Switch
                      checked={notificationSettings.comments}
                      onCheckedChange={(checked) => handleNotificationSettingsChange("comments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-green-500" />
                      <span>Nuevos seguidores</span>
                    </div>
                    <Switch
                      checked={notificationSettings.follows}
                      onCheckedChange={(checked) => handleNotificationSettingsChange("follows", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>Invitaciones a espacios</span>
                    </div>
                    <Switch
                      checked={notificationSettings.spaceInvites}
                      onCheckedChange={(checked) => handleNotificationSettingsChange("spaceInvites", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Visibilidad del perfil</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacySettingsChange("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="friends">Solo amigos</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mostrar estado en línea</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros vean cuando estás activo
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => handlePrivacySettingsChange("showOnlineStatus", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Mostrar facetas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros vean tus facetas activas
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showFacets}
                    onCheckedChange={(checked) => handlePrivacySettingsChange("showFacets", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quién puede enviarme mensajes</Label>
                  <Select
                    value={privacySettings.allowMessages}
                    onValueChange={(value) => handlePrivacySettingsChange("allowMessages", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Todos</SelectItem>
                      <SelectItem value="friends">Solo amigos</SelectItem>
                      <SelectItem value="none">Nadie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value) => handleAppearanceSettingsChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Oscuro
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Automático
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={appearanceSettings.language}
                    onValueChange={(value) => handleAppearanceSettingsChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de fuente</Label>
                  <Select
                    value={appearanceSettings.fontSize}
                    onValueChange={(value) => handleAppearanceSettingsChange("fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Reducir movimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce las animaciones para mejor accesibilidad
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.reduceMotion}
                    onCheckedChange={(checked) => handleAppearanceSettingsChange("reduceMotion", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alto contraste</Label>
                    <p className="text-sm text-muted-foreground">
                      Mejora la legibilidad con mayor contraste
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(checked) => handleAppearanceSettingsChange("highContrast", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Recopilación de datos</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que Lumora recopile datos para mejorar la experiencia
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataCollection}
                    onCheckedChange={(checked) => handlePrivacySettingsChange("dataCollection", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" onClick={handleExportData} className="gap-2 w-full">
                    <Download className="h-4 w-4" />
                    Exportar mis datos
                  </Button>
                  <Button variant="outline" className="gap-2 w-full">
                    <Upload className="h-4 w-4" />
                    Importar datos
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-destructive">Zona de peligro</h4>
                        <p className="text-sm text-muted-foreground">
                          Estas acciones son irreversibles y eliminarán permanentemente tu cuenta y todos tus datos.
                        </p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setShowDeleteModal(true)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar cuenta
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Safety Validation Account Deletion Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              ¿Estás absolutamente seguro?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
              Esta acción es <strong>completamente irreversible</strong>. Se eliminará de forma permanente tu perfil, facetas, espacios, publicaciones y todos tus datos asociados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <p className="text-xs text-muted-foreground">
              Para confirmar la eliminación permanente, escribe exactamente <span className="font-bold text-foreground">ELIMINAR</span> a continuación:
            </p>
            <Input
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              placeholder="Escribe 'ELIMINAR' para confirmar"
              className="border-destructive/30 focus-visible:ring-destructive"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setConfirmDeleteText("")
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={confirmDeleteText !== "ELIMINAR" || isDeleting}
              className="min-w-[120px]"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Eliminando..." : "Eliminar permanentemente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
