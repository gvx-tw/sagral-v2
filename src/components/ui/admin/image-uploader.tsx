'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

// Tipos para el widget de Cloudinary
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (error: CloudinaryError | null, result: CloudinaryResult) => void
      ) => CloudinaryWidget
    }
  }
}

type CloudinaryTextValue = string | Record<string, string>

interface CloudinaryWidgetOptions {
  cloudName: string
  uploadPreset: string
  multiple: boolean
  maxFiles: number
  folder: string
  resourceType: string
  clientAllowedFormats: string[]
  maxFileSize: number
  language: string
  text: Record<string, Record<string, CloudinaryTextValue>>
}

interface CloudinaryError {
  message: string
}

interface CloudinaryResult {
  event: string
  info: {
    secure_url: string
    public_id: string
  }
}

interface CloudinaryWidget {
  open: () => void
  destroy: () => void
}

interface ImageUploaderProps {
  vehicleId: string
  currentCount: number
  onUploadSuccess: (image: { id: string; url: string; publicId: string; order: number; isCover: boolean }) => void
}

export function ImageUploader({ vehicleId, currentCount, onUploadSuccess }: ImageUploaderProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Cargar el script de Cloudinary si no está cargado
    if (!document.getElementById('cloudinary-widget-script')) {
      const script = document.createElement('script')
      script.id = 'cloudinary-widget-script'
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
      script.async = true
      scriptRef.current = script
      document.head.appendChild(script)
    }

    return () => {
      widgetRef.current?.destroy()
    }
  }, [])

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget no cargado todavía')
      return
    }

    // Destruir instancia previa si existe
    widgetRef.current?.destroy()

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        multiple: true,
        maxFiles: 10 - currentCount,
        folder: `sagral/vehicles/${vehicleId}`,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 10_000_000, // 10MB
        language: 'es',
        text: {
          es: {
            or: 'o',
            back: 'Volver',
            advanced: 'Avanzado',
            close: 'Cerrar',
            no_results: 'Sin resultados',
            search_placeholder: 'Buscar archivos',
            about_uw: 'Acerca del widget',
            menu: { files: 'Archivos', web: 'Web', camera: 'Cámara' },
            selection_counter: { file: 'archivo', files: 'archivos' },
            actions: { upload: 'Subir', clear_all: 'Limpiar todo', log_out: 'Salir' },
            notifications: {
              general_error: 'Ocurrió un error',
              general_prompt: 'Arrastrá o seleccioná imágenes',
              limit_reached: 'No podés subir más archivos',
              invalid_add_url: 'URL inválida',
              profile_change: 'Nuevo perfil seleccionado',
              upload_fail: 'Error al subir',
              upload_wrap_fail: 'Error al procesar',
              image_purchased: 'Imagen comprada',
              video_purchased: 'Video comprado',
            },
          },
        },
      },
      async (error, result) => {
        if (error) {
          console.error('Error en widget:', error.message)
          return
        }

        if (result.event === 'success') {
          const { secure_url, public_id } = result.info

          try {
            const res = await fetch('/api/images/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                vehicleId,
                url: secure_url,
                publicId: public_id,
                order: currentCount,
              }),
            })

            if (!res.ok) throw new Error('Error al guardar imagen')

            const saved = await res.json()
            onUploadSuccess(saved)
          } catch (err) {
            console.error('Error al persistir imagen:', err)
          }
        }
      }
    )

    widgetRef.current.open()
  }

  const remaining = 10 - currentCount

  return (
    <Button
      type="button"
      variant="outline"
      onClick={openWidget}
      disabled={remaining <= 0}
      className="gap-2"
    >
      <Upload className="h-4 w-4" />
      {remaining > 0
        ? `Subir imágenes (${remaining} disponibles)`
        : 'Límite de imágenes alcanzado'}
    </Button>
  )
}