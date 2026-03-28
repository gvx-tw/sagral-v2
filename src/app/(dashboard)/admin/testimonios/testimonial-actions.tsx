'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toggleVisible, deleteTestimonial } from './actions'
import { Eye, EyeOff, Trash2 } from 'lucide-react'

export function TestimonialActions({
  id,
  isVisible,
}: {
  id: string
  isVisible: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setLoading(true)
    await toggleVisible(id, isVisible)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este testimonio?')) return
    setLoading(true)
    await deleteTestimonial(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${
          isVisible
            ? 'text-emerald-400 hover:text-zinc-400'
            : 'text-zinc-400 hover:text-emerald-400'
        }`}
        onClick={handleToggle}
        disabled={loading}
        title={isVisible ? 'Ocultar' : 'Mostrar'}
      >
        {isVisible ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}