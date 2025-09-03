"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, Image, Video, Music, File, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatFileSize } from "@/lib/utils"

interface FileUpload {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface FileSharingProps {
  onClose: () => void
  onFileUpload: (files: File[]) => void
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
}

export function FileSharing({ 
  onClose, 
  onFileUpload, 
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedTypes = ["image/*", "video/*", "audio/*", "application/pdf", "text/*"]
}: FileSharingProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList) => {
    const newUploads: FileUpload[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const
    }))

    setUploads(prev => [...prev, ...newUploads])

    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id)
    })

    onFileUpload(Array.from(files))
  }

  const simulateUpload = (uploadId: string) => {
    const interval = setInterval(() => {
      setUploads(prev => prev.map(upload => {
        if (upload.id === uploadId) {
          const newProgress = Math.min(upload.progress + Math.random() * 20, 100)
          const newStatus = newProgress >= 100 ? "completed" : "uploading"
          
          if (newStatus === "completed") {
            clearInterval(interval)
          }
          
          return { ...upload, progress: newProgress, status: newStatus }
        }
        return upload
      }))
    }, 200)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `El archivo es demasiado grande. Máximo ${formatFileSize(maxFileSize)}`
    }
    
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -2))
      }
      return file.type === type
    })
    
    if (!isAllowed) {
      return "Tipo de archivo no permitido"
    }
    
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Compartir archivos</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Upload Area */}
        <div className="p-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/10" 
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Seleccionar archivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File Info */}
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Tipos permitidos: Imágenes, videos, audio, PDF, documentos</p>
            <p>Tamaño máximo: {formatFileSize(maxFileSize)}</p>
          </div>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="font-medium text-sm mb-2">Archivos ({uploads.length})</h4>
            <div className="space-y-2">
              {uploads.map((upload) => {
                const error = validateFile(upload.file)
                
                return (
                  <div key={upload.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                    {getFileIcon(upload.file)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{upload.file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(upload.file.size)}
                      </div>
                      
                      {upload.status === "uploading" && (
                        <Progress value={upload.progress} className="mt-1 h-1" />
                      )}
                      
                      {error && (
                        <Alert variant="destructive" className="mt-1 py-1">
                          <AlertCircle className="w-3 h-3" />
                          <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {upload.status === "completed" && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {upload.status === "error" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onClose}
            disabled={uploads.some(upload => upload.status === "uploading")}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}
