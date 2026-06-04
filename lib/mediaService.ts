import { apiService } from './api'

/**
 * Uploads a file directly to AWS S3 using a Presigned PUT URL.
 * Bypasses apiService auth headers to prevent credentials/JWT leaks.
 * 
 * @param file The File object from input selection
 * @returns The unique S3 key representing the uploaded file
 */
export async function uploadFileToS3(file: File): Promise<string> {
  // Client-side file size constraint (5MB)
  const maxBytes = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxBytes) {
    throw new Error('El archivo es demasiado grande. El límite es de 5MB.')
  }

  // Step 1: Request presigned URL from Lumora Backend
  const response = await apiService.getPresignedUrl(file.name, file.type) as any

  let uploadUrl = ''
  let key = ''

  if (response && response.uploadUrl && response.key) {
    uploadUrl = response.uploadUrl
    key = response.key
  } else if (response && response.success && response.data) {
    uploadUrl = response.data.uploadUrl
    key = response.data.key
  } else {
    throw new Error(response?.message || 'No se pudo obtener la URL de subida de S3.')
  }

  // Step 2: Upload file binary directly to AWS S3 using PUT
  // Standard fetch is used directly to avoid sending JWT Authorization header to AWS
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error(`Error al subir la imagen al almacenamiento: ${uploadResponse.statusText}`)
  }

  // Return the unique S3 key representing the uploaded asset
  return key
}

/**
 * Resolves a media key or URL into a fully-qualified public URL.
 * Supports S3 relative keys, absolute URLs, relative local paths, and placeholders.
 * 
 * @param keyOrUrl The file path, S3 key, or absolute URL from the database
 * @param fallback The fallback asset URL if keyOrUrl is missing
 * @returns The fully-resolved absolute URL for image rendering
 */
export function getMediaUrl(keyOrUrl: string | null | undefined, fallback = '/placeholder.svg'): string {
  if (!keyOrUrl) return fallback

  // If it's already an absolute URL (e.g. http://, https://, data:) or a local relative path, return it as-is
  if (
    keyOrUrl.startsWith('http://') ||
    keyOrUrl.startsWith('https://') ||
    keyOrUrl.startsWith('data:') ||
    keyOrUrl.startsWith('/')
  ) {
    return keyOrUrl
  }

  // Retrieve public S3 config from environment, fallback to production default if not defined
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET || 'lumora-public-media-prod-983240697548-us-east-2-an'
  const region = process.env.NEXT_PUBLIC_S3_REGION || 'us-east-2'

  return `https://${bucketName}.s3.${region}.amazonaws.com/${keyOrUrl}`
}
