"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for existing session
    const savedUser = localStorage.getItem("lumora_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "1",
        username: "alex_artist",
        email,
        avatar: "/diverse-user-avatars.png",
        bio: "Explorando la intersección entre arte y tecnología.",
        createdAt: new Date(),
        facets: [
          {
            id: "1",
            name: "Artista",
            description: "Portfolio, arte generativo, exhibiciones",
            isActive: true,
            category: "artista",
          },
          {
            id: "2",
            name: "Profesional",
            description: "CV, logros, publicaciones",
            isActive: false,
            category: "profesional",
          },
        ],
        isOnline: true,
      }

      setUser(mockUser)
      localStorage.setItem("lumora_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        avatar: "/diverse-user-avatars.png",
        bio: "",
        createdAt: new Date(),
        facets: [],
        isOnline: true,
      }

      setUser(newUser)
      localStorage.setItem("lumora_user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Register error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lumora_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
