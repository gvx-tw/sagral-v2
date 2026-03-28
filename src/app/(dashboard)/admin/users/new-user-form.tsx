'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser } from './actions'
import { UserPlus } from 'lucide-react'

export function NewUserForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await createUser(formData)
      router.refresh()
      setOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      alert(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-300">Crear usuario</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white gap-2"
          onClick={() => setOpen(!open)}
        >
          <UserPlus className="w-4 h-4" />
          {open ? 'Cancelar' : 'Nuevo usuario'}
        </Button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Nombre</Label>
              <Input
                name="name"
                required
                placeholder="Juan Pérez"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Email</Label>
              <Input
                name="email"
                type="email"
                required
                placeholder="juan@sagralautomotores.com"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Contraseña</Label>
              <Input
                name="password"
                type="password"
                required
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Rol</Label>
              <select
                name="role"
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm"
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-zinc-900 hover:bg-zinc-200"
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}