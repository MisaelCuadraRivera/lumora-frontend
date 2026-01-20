"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"
import { apiService, type LoginResponseData, type RegisterResponseData, type ProfileResponseData } from "@/lib/api"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>
  register: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [lastTokenCheck, setLastTokenCheck] = useState<number>(0)
  const [isCheckingSession, setIsCheckingSession] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar sesión existente al cargar
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    // Evitar llamadas múltiples simultáneas
    if (isCheckingSession) {
      return
    }

    // Debouncing: evitar verificaciones muy frecuentes (mínimo 5 segundos entre verificaciones)
    const now = Date.now()
    if (now - lastTokenCheck < 5000) {
      setLoading(false)
      return
    }

    setIsCheckingSession(true)
    setLastTokenCheck(now)

    try {
      // Verificar si hay token guardado
      const token = localStorage.getItem("lumora_token")
      if (!token) {
        setLoading(false)
        return
      }

      // Verificar si hay datos de usuario en cache
      const cachedUser = localStorage.getItem("lumora_user")
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser)
          setUser(userData)
          setLoading(false)
          
          // Verificar token en background sin bloquear la UI
          setTimeout(async () => {
            try {
              const response = await apiService.verifyToken()
              if (!response.success) {
                // Token inválido, limpiar
                localStorage.removeItem("lumora_token")
                localStorage.removeItem("lumora_user")
                setUser(null)
              }
            } catch (error) {
              console.error("Error verificando token en background:", error)
            }
          }, 1000)
          
          return
        } catch (error) {
          console.error("Error parsing cached user:", error)
          localStorage.removeItem("lumora_user")
        }
      }

      // Verificar token con el backend solo si no hay cache
      const response = await apiService.verifyToken()
      if (response.success && response.data) {
        const userData = response.data as ProfileResponseData
        
        // Convertir datos del backend al formato del frontend
        const frontendUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || "/diverse-user-avatars.png",
          bio: userData.bio || "",
          createdAt: new Date(userData.createdAt),
          facets: userData.facets || [],
          isOnline: true,
          isVerified: userData.isVerified || false,
          preferences: userData.preferences || {},
          followers: userData.followers || [],
          following: userData.following || [],
          blockedUsers: userData.blockedUsers || [],
          stats: userData.stats || {
            posts: 0,
            followers: 0,
            following: 0,
            likes: 0,
            views: 0
          }
        }
        
        setUser(frontendUser)
        localStorage.setItem("lumora_user", JSON.stringify(frontendUser))
      } else {
        // Token inválido, limpiar
        localStorage.removeItem("lumora_token")
        localStorage.removeItem("lumora_user")
        setUser(null)
      }
    } catch (error) {
      console.error("Error verificando sesión:", error)
      // Limpiar datos inválidos
      localStorage.removeItem("lumora_token")
      localStorage.removeItem("lumora_user")
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingSession(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true)
    try {
      const response = await apiService.login(email, password)
      
      if (response.success && response.data) {
        const { user: userData, facets, token }: LoginResponseData = response.data
        
        // Convertir datos del backend al formato del frontend
        const frontendUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || "/diverse-user-avatars.png",
          bio: userData.bio || "",
          createdAt: new Date(userData.createdAt),
          facets: facets || [],
          isOnline: true,
          isVerified: userData.isVerified || false,
          preferences: userData.preferences || {},
          followers: userData.followers || [],
          following: userData.following || [],
          blockedUsers: userData.blockedUsers || [],
          stats: userData.stats || {
            posts: 0,
            followers: 0,
            following: 0,
            likes: 0,
            views: 0
          }
        }

        setUser(frontendUser)
        localStorage.setItem("lumora_user", JSON.stringify(frontendUser))
        
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || "Error en el login" }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Error de conexión" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string, 
    password: string, 
    username: string, 
    firstName: string, 
    lastName: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true)
    try {
      const response = await apiService.register({
        email,
        password,
        username,
        firstName,
        lastName
      })
      
      if (response.success && response.data) {
        const { user: userData, facet, token }: RegisterResponseData = response.data
        
        // Convertir datos del backend al formato del frontend
        const frontendUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || "/diverse-user-avatars.png",
          bio: userData.bio || "",
          createdAt: new Date(userData.createdAt),
          facets: facet ? [facet] : [],
          isOnline: true,
          isVerified: userData.isVerified || false,
          preferences: userData.preferences || {},
          followers: userData.followers || [],
          following: userData.following || [],
          blockedUsers: userData.blockedUsers || [],
          stats: userData.stats || {
            posts: 0,
            followers: 0,
            following: 0,
            likes: 0,
            views: 0
          }
        }

        setUser(frontendUser)
        localStorage.setItem("lumora_user", JSON.stringify(frontendUser))
        
        return { success: true, message: response.message }
      } else {
        return { success: false, message: response.message || "Error en el registro" }
      }
    } catch (error: any) {
      console.error("Register error:", error)
      return { success: false, message: error.message || "Error de conexión" }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const token = await user.getIdToken()
      
      // Enviar token al backend para validación y creación de sesión
      const apiResponse = await apiService.loginWithGoogle(token)
      
      if (apiResponse.success && apiResponse.data) {
        const { user: userData, facets }: LoginResponseData = apiResponse.data
        
        // Convertir datos del backend al formato del frontend
        const frontendUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || "/diverse-user-avatars.png",
          bio: userData.bio || "",
          createdAt: new Date(userData.createdAt),
          facets: facets || [],
          isOnline: true,
          isVerified: userData.isVerified || false,
          preferences: userData.preferences || {},
          followers: userData.followers || [],
          following: userData.following || [],
          blockedUsers: userData.blockedUsers || [],
          stats: userData.stats || {
            posts: 0,
            followers: 0,
            following: 0,
            likes: 0,
            views: 0
          }
        }

        setUser(frontendUser)
        localStorage.setItem("lumora_user", JSON.stringify(frontendUser))
        return { success: true, message: apiResponse.message }
      } else {
        return { success: false, message: apiResponse.message || "Error al validar con el servidor" }
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    apiService.setToken(null)
    localStorage.removeItem("lumora_user")
    localStorage.removeItem("lumora_token")
  }

  const refreshUser = async () => {
    // Evitar múltiples llamadas simultáneas
    if (isCheckingSession) {
      return
    }

    setIsCheckingSession(true)
    try {
      const response = await apiService.getProfile()
      if (response.success && response.data) {
        const userData = response.data as ProfileResponseData
        
        // Convertir datos del backend al formato del frontend
        const frontendUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || "/diverse-user-avatars.png",
          bio: userData.bio || "",
          createdAt: new Date(userData.createdAt),
          facets: userData.facets || [],
          isOnline: true,
          isVerified: userData.isVerified || false,
          preferences: userData.preferences || {},
          followers: userData.followers || [],
          following: userData.following || [],
          blockedUsers: userData.blockedUsers || [],
          stats: userData.stats || {
            posts: 0,
            followers: 0,
            following: 0,
            likes: 0,
            views: 0
          }
        }

        setUser(frontendUser)
        localStorage.setItem("lumora_user", JSON.stringify(frontendUser))
        setLastTokenCheck(Date.now())
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      // Si hay error, limpiar cache y volver a verificar
      localStorage.removeItem("lumora_user")
      localStorage.removeItem("lumora_token")
      setUser(null)
    } finally {
      setIsCheckingSession(false)
    }
  }

  const clearCache = () => {
    localStorage.removeItem("lumora_user")
    localStorage.removeItem("lumora_token")
    setUser(null)
    setLastTokenCheck(0)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser, loginWithGoogle }}>
      {mounted ? children : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
