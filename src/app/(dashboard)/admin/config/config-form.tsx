'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveConfig } from './actions'

const fields = [
  { key: 'phone', label: 'Teléfono', placeholder: '+54 362 400-0000' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '+54 362 400-0000' },
  { key: 'email', label: 'Email', placeholder: 'info@sagralautomotores.com' },
  { key: 'address', label: 'Dirección', placeholder: 'Av. ejemplo 1234, Sáenz Peña' },
  { key: 'hours', label: 'Horarios', placeholder: 'Lun-Vie 9:00-18:00' },
  { key: 'instagram', label: 'Instagram', placeholder: '@sagralautomotores' },
  { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/sagral' },
]

export function ConfigForm({ config }: { config: Record<string, string> }) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await saveConfig(formData)
    router.refresh()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
          Contacto y ubicación
        </h2>
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <Label className="text-zinc-400">{label}</Label>
            <Input
              name={key}
              defaultValue={config[key] ?? ''}
              placeholder={placeholder}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-emerald-400">
            ✓ Guardado correctamente
          </span>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-white text-zinc-900 hover:bg-zinc-200"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}