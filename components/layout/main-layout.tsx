"use client"

import React from "react"
import { useAuth, AuthProvider } from "@/lib/auth"
import { ResponsiveSidebarLayout } from "./responsive-sidebar-layout"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { LumoraLogo } from "@/components/ui/lumora-logo"
import { ApiDebugPanel } from "@/components/debug/api-debug-panel"

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, loading, pathname, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <LumoraLogo width={48} height={48} className="drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Lumora
          </h1>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <LumoraLogo width={48} height={48} className="drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Lumora
          </h1>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (!user && pathname !== "/login") {
    return null
  }

  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ResponsiveSidebarLayout>
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </ResponsiveSidebarLayout>
      </div>
      {/* <ApiDebugPanel /> */}
    </div>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AuthProvider>
  )
}
