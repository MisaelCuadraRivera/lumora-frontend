import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Syne } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lumora - Social Network",
  description: "Una red social para explorar los confines de la imaginación",
  generator: "v0.app",
}

const syne = Syne({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syne" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${syne.variable} font-syne antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
