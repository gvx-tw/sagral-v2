'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteVehicle, toggleSold } from './actions'
import { Pencil, Trash2, CheckCircle, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export function VehicleActions({ id, isSold }: { id: string; isSold: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('¿Eliminar este vehículo? Esta acción no se puede deshacer.')) return
    setLoading(true)
    const result = await deleteVehicle(id)
    if (!result.sheetsSync) {
      toast.warning('Vehículo eliminado. No se pudo sincronizar con Google Sheets.')
    }
    router.refresh()
    setLoading(false)
  }

  async function handleToggleSold() {
    setLoading(true)
    const result = await toggleSold(id, isSold)
    if (!result.sheetsSync) {
      toast.warning('Estado actualizado. No se pudo sincronizar con Google Sheets.')
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/vehicles/${id}/edit`}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${isSold ? 'text-zinc-400 hover:text-emerald-400' : 'text-emerald-400 hover:text-zinc-400'}`}
        onClick={handleToggleSold}
        disabled={loading}
        title={isSold ? 'Marcar disponible' : 'Marcar vendido'}
      >
        {isSold ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
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