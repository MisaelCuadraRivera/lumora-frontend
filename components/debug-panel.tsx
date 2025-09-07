"use client"

import { useAuth } from "@/lib/auth"
import { useSpaces } from "@/hooks/useSpaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DebugPanel() {
  const { user, loading: authLoading } = useAuth()
  const { spaces, loading, error } = useSpaces()

  // Obtener token del localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('lumora_token') : null
  const isAuthenticated = !!user && !!token

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">🔧 Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-yellow-800 mb-2">Authentication Status:</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Is Authenticated:</strong> <Badge variant={isAuthenticated ? "default" : "destructive"}>{isAuthenticated ? "Yes" : "No"}</Badge></p>
            <p><strong>Token:</strong> {token ? "Present" : "Missing"}</p>
            <p><strong>User:</strong> {user ? `${user.username} (${user.id})` : "None"}</p>
            <p><strong>Auth Loading:</strong> <Badge variant={authLoading ? "default" : "secondary"}>{authLoading ? "Yes" : "No"}</Badge></p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-yellow-800 mb-2">Spaces Status:</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Loading:</strong> <Badge variant={loading ? "default" : "secondary"}>{loading ? "Yes" : "No"}</Badge></p>
            <p><strong>Error:</strong> {error || "None"}</p>
            <p><strong>Spaces Count:</strong> {spaces.length}</p>
            {spaces.length > 0 && (
              <div>
                <p><strong>Spaces:</strong></p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(spaces, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
