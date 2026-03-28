'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toggleAttended, deleteLead } from './actions'
import { CheckCircle, RotateCcw, Trash2 } from 'lucide-react'

export function LeadActions({
  id,
  isAttended,
}: {
  id: string
  isAttended: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setLoading(true)
    await toggleAttended(id, isAttended)
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este lead?')) return
    setLoading(true)
    await deleteLead(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${
          isAttended
            ? 'text-zinc-400 hover:text-amber-400'
            : 'text-amber-400 hover:text-zinc-400'
        }`}
        onClick={handleToggle}
        disabled={loading}
        title={isAttended ? 'Marcar pendiente' : 'Marcar atendido'}
      >
        {isAttended ? (
          <RotateCcw className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5" />
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