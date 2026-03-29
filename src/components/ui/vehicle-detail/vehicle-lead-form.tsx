// src/components/vehicle-detail/vehicle-lead-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { LeadFormData } from '@/types/vehicle-detail'

interface VehicleLeadFormProps {
  vehicleId: string
  vehicleName: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function VehicleLeadForm({ vehicleId, vehicleName }: VehicleLeadFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: `Hola, me interesa el ${vehicleName}. ¿Está disponible?`,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const payload: LeadFormData = {
      vehicleId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      message: form.message.trim(),
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al enviar')
      }

      setState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar la consulta')
      setState('error')
    }
  }

  // Estado success
  if (state === 'success') {
    return (
      <div className="rounded-xl border bg-card p-6 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <h3 className="font-semibold text-lg">¡Consulta enviada!</h3>
        <p className="text-muted-foreground text-sm">
          Te contactaremos a la brevedad al número <strong>{form.phone}</strong>.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setState('idle')}
          className="mt-2"
        >
          Enviar otra consulta
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-lg">Consultar este vehículo</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Completá el formulario y te respondemos a la brevedad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
            disabled={state === 'loading'}
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Ej: 11 2345 6789"
            required
            disabled={state === 'loading'}
          />
        </div>

        {/* Email (opcional) */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-muted-foreground text-xs">(opcional)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            disabled={state === 'loading'}
          />
        </div>

        {/* Mensaje */}
        <div className="space-y-1.5">
          <Label htmlFor="message">
            Mensaje <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            required
            disabled={state === 'loading'}
          />
        </div>

        {/* Error */}
        {state === 'error' && (
          <p className="text-destructive text-sm">{errorMsg}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#DDB43C] hover:bg-[#B8941F] text-black border-transparent"
          disabled={state === 'loading'}
        >
          {state === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar consulta'
          )}
        </Button>
      </form>
    </div>
  )
}