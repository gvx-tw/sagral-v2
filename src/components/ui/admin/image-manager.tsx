'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ManagedImage {
  id: string
  url: string
  publicId: string
  order: number
  isCover: boolean
}

interface ImageManagerProps {
  images: ManagedImage[]
  onChange: (images: ManagedImage[]) => void
}

// ─── Item sortable individual ─────────────────────────────────────────────────

interface SortableImageProps {
  image: ManagedImage
  onDelete: (id: string) => void
  onCover: (id: string) => void
  isDeleting: boolean
  isSettingCover: boolean
}

function SortableImage({
  image,
  onDelete,
  onCover,
  isDeleting,
  isSettingCover,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group aspect-[4/3] rounded-lg overflow-hidden border-2 bg-muted',
        image.isCover ? 'border-primary' : 'border-transparent',
        isDragging ? 'opacity-50 z-50 shadow-xl' : 'opacity-100',
      )}
    >
      {/* Handle de drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
      />

      {/* Imagen */}
      <Image
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_300,c_fill,f_auto,q_auto/${image.publicId}`}
        alt="Imagen del vehículo"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Badge cover */}
      {image.isCover && (
        <div className="absolute top-2 left-2 z-20 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          Portada
        </div>
      )}

      {/* Acciones — visibles al hover */}
      <div className="absolute bottom-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          size="icon"
          variant={image.isCover ? 'default' : 'secondary'}
          className="h-7 w-7"
          onClick={() => onCover(image.id)}
          disabled={isSettingCover || image.isCover}
          title="Marcar como portada"
        >
          <Star className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          title="Eliminar imagen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ─── Image Manager principal ──────────────────────────────────────────────────

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [coveringId, setCoveringId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // ── Drag end → reorder ──────────────────────────────────────────────────────
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      order: i,
    }))

    // Optimista: actualizar UI antes de la llamada
    onChange(reordered)

    try {
      const res = await fetch('/api/images/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: reordered.map(({ id, order }) => ({ id, order })),
        }),
      })
      if (!res.ok) throw new Error('Error al reordenar')
    } catch (err) {
      console.error(err)
      // Revertir al orden anterior si falla
      onChange(images)
    }
  }

  // ── Cover ───────────────────────────────────────────────────────────────────
  async function handleCover(id: string) {
    setCoveringId(id)

    // Optimista
    onChange(images.map((img) => ({ ...img, isCover: img.id === id })))

    try {
      const res = await fetch(`/api/images/${id}/cover`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Error al marcar portada')
    } catch (err) {
      console.error(err)
      // Revertir
      onChange(images)
    } finally {
      setCoveringId(null)
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('¿Eliminás esta imagen? La acción no se puede deshacer.')) return
    setDeletingId(id)

    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar imagen')

      const updated = images
        .filter((img) => img.id !== id)
        .map((img, i) => ({ ...img, order: i }))

      onChange(updated)
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm">
        No hay imágenes cargadas todavía
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onDelete={handleDelete}
              onCover={handleCover}
              isDeleting={deletingId === image.id}
              isSettingCover={coveringId === image.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}