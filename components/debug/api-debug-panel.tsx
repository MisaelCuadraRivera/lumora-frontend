"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { apiService } from "@/lib/api"
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Database } from "lucide-react"

interface ApiCall {
  timestamp: number
  endpoint: string
  method: string
  status: 'success' | 'error' | 'pending'
  duration?: number
  error?: string
}

export function ApiDebugPanel() {
  const { user, loading } = useAuth()
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [lastTokenCheck, setLastTokenCheck] = useState<number>(0)

  // Solo mostrar en desarrollo y cuando el usuario esté autenticado
  if (process.env.NODE_ENV !== 'development' || !user) {
    return null
  }

  useEffect(() => {
    // Interceptar llamadas a la API
    const originalRequest = apiService.request
    apiService.request = async function(endpoint: string, options: RequestInit = {}) {
      const callId = Date.now()
      const startTime = performance.now()
      
      // Agregar llamada pendiente
      setApiCalls(prev => [...prev, {
        timestamp: callId,
        endpoint,
        method: options.method || 'GET',
        status: 'pending'
      }])

      try {
        const result = await originalRequest.call(this, endpoint, options)
        const duration = performance.now() - startTime
        
        // Actualizar llamada como exitosa
        setApiCalls(prev => prev.map(call => 
          call.timestamp === callId 
            ? { ...call, status: 'success', duration }
            : call
        ))
        
        return result
      } catch (error: any) {
        const duration = performance.now() - startTime
        
        // Actualizar llamada como error
        setApiCalls(prev => prev.map(call => 
          call.timestamp === callId 
            ? { ...call, status: 'error', duration, error: error.message }
            : call
        ))
        
        throw error
      }
    }

    // Limpiar llamadas antiguas cada 30 segundos
    const cleanup = setInterval(() => {
      setApiCalls(prev => prev.filter(call => 
        Date.now() - call.timestamp < 30000
      ))
    }, 30000)

    return () => {
      clearInterval(cleanup)
      // Restaurar método original
      apiService.request = originalRequest
    }
  }, [])

  const clearCalls = () => {
    setApiCalls([])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return null
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '-'
    return `${duration.toFixed(0)}ms`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        <Database className="w-4 h-4 mr-2" />
        API Debug ({apiCalls.length})
      </Button>

      {isVisible && (
        <Card className="w-96 max-h-96 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">API Debug Panel</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={clearCalls}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="outline"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {/* Estado de autenticación */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Auth Status:</span>
                {user ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Logged in as {user.username}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not logged in</Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last token check: {lastTokenCheck ? formatTime(lastTokenCheck) : 'Never'}
              </div>
            </div>

            <Separator />

            {/* Lista de llamadas API */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Recent API Calls:</div>
              {apiCalls.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No API calls yet
                </div>
              ) : (
                <div className="space-y-1">
                  {apiCalls.slice(-10).reverse().map((call) => (
                    <div key={call.timestamp} className="text-xs border rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(call.status)}
                          <span className="font-mono">{call.method}</span>
                          <span className="text-muted-foreground">{call.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(call.status)}
                          <span className="text-muted-foreground">{formatDuration(call.duration)}</span>
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {formatTime(call.timestamp)}
                      </div>
                      {call.error && (
                        <div className="text-red-500 mt-1">
                          Error: {call.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <Separator />
            <div className="text-xs text-muted-foreground">
              <div>Total calls: {apiCalls.length}</div>
              <div>Success: {apiCalls.filter(c => c.status === 'success').length}</div>
              <div>Errors: {apiCalls.filter(c => c.status === 'error').length}</div>
              <div>Pending: {apiCalls.filter(c => c.status === 'pending').length}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
