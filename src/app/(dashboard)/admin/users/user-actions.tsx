'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toggleUserActive, changeUserRole } from './actions'
import { UserX, UserCheck } from 'lucide-react'

export function UserActions({
  id,
  role,
  currentUserId,
}: {
  id: string
  role: string
  currentUserId: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isSelf = id === currentUserId
  const isDeactivated = role === 'desactivado'

  async function handleToggleActive() {
    setLoading(true)
    try {
      await toggleUserActive(id, role)
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    }
    setLoading(false)
  }

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    try {
      await changeUserRole(id, e.target.value)
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {!isSelf && (
        <>
          <select
            value={role}
            onChange={handleRoleChange}
            disabled={loading || isDeactivated}
            className="h-8 px-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs"
          >
            <option value="admin">admin</option>
            <option value="vendedor">vendedor</option>
          </select>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isDeactivated
                ? 'text-zinc-400 hover:text-emerald-400'
                : 'text-zinc-400 hover:text-red-400'
            }`}
            onClick={handleToggleActive}
            disabled={loading}
            title={isDeactivated ? 'Activar usuario' : 'Desactivar usuario'}
          >
            {isDeactivated ? (
              <UserCheck className="w-3.5 h-3.5" />
            ) : (
              <UserX className="w-3.5 h-3.5" />
            )}
          </Button>
        </>
      )}
      {isSelf && (
        <span className="text-xs text-zinc-600">tu cuenta</span>
      )}
    </div>
  )
}