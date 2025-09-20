"use client"

import { SidebarProvider, Sidebar as ResponsiveSidebar } from "@/components/ui/sidebar"
import { Sidebar as SidebarContent } from "@/components/layout/sidebar"
import { Header } from "./header"
import React from "react"

export function ResponsiveSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <ResponsiveSidebar>
          <SidebarContent />
        </ResponsiveSidebar>
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
