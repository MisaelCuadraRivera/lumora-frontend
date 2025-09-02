import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lumora - Social Network",
  description: "Una red social para explorar los confines de la imaginación",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
