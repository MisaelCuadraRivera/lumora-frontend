"use client"

import { FacetManager } from "@/components/profile/facet-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FacetsManagementPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Perfil
          </Button>
        </Link>
      </div>

      <FacetManager />
    </div>
  )
}
