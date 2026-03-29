// src/components/vehicle-detail/vehicle-gallery.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { VehicleImage } from '@/types/vehicle-detail'

interface VehicleGalleryProps {
  images: VehicleImage[]
  vehicleName: string
}

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const sorted = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const hasImages = sorted.length > 0
  const current = hasImages ? sorted[currentIndex] : null

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? sorted.length - 1 : i - 1))
  }, [sorted.length])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === sorted.length - 1 ? 0 : i + 1))
  }, [sorted.length])

  // Swipe support
  let touchStartX = 0
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, prev, next])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (!hasImages) {
    return (
      <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Sin imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div
        className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted group cursor-zoom-in"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={current!.url}
          alt={`${vehicleName} - imagen ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {/* Overlay zoom */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200 w-8 h-8 drop-shadow-lg" />
        </div>

        {/* Flechas — solo si hay más de 1 imagen */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Contador */}
        {sorted.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {sorted.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex
                  ? 'border-[#DDB43C] shadow-md scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={`${vehicleName} miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${vehicleName}`}
        >
          {/* Botón cerrar */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar galería"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Flechas */}
          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-[#DDB43C]/80 text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-[#DDB43C]/80 text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Imagen grande */}
          <div
            className="relative w-full max-w-5xl max-h-[80vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current!.url}
              alt={`${vehicleName} - imagen ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Contador + hint teclado */}
          <div className="absolute bottom-4 flex flex-col items-center gap-1">
            <span className="text-white/80 text-sm font-medium">
              {currentIndex + 1} / {sorted.length}
            </span>
            <span className="text-white/30 text-xs hidden md:block">
              ← → para navegar · ESC para cerrar
            </span>
          </div>
        </div>
      )}
    </div>
  )
}