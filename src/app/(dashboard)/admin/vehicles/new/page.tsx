'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createVehicle } from '../actions'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewVehiclePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)
  const formData = new FormData(e.currentTarget)
  const result = await createVehicle(formData)
  if (!result.sheetsSync) {
    toast.warning('Vehículo creado. No se pudo sincronizar con Google Sheets.')
  }
  // Redirigir al edit para subir imágenes
  router.push(`/admin/vehicles/${result.id}/edit`)
}

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/vehicles">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white p-0 h-auto">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">Nuevo vehículo</h1>
          <p className="text-zinc-400 text-sm">Completá los datos del vehículo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
            Datos principales
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Marca</Label>
              <Input name="brand" required placeholder="Toyota"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Modelo</Label>
              <Input name="model" required placeholder="Corolla"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Año</Label>
              <Input name="year" type="number" required placeholder="2022"
                min="1990" max="2030"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-zinc-400">Precio</Label>
              <div className="flex gap-2">
                <select name="currency"
                  className="h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm w-24">
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
                <Input name="price" type="number" required placeholder="15000" min="0"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 flex-1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Color</Label>
              <Input name="color" placeholder="Blanco"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Condición</Label>
              <select name="condition" required
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                <option value="usado">Usado</option>
                <option value="nuevo">Nuevo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Combustible</Label>
              <select name="fuelType" required
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                <option value="nafta">Nafta</option>
                <option value="diesel">Diésel</option>
                <option value="gnc">GNC</option>
                <option value="hibrido">Híbrido</option>
                <option value="electrico">Eléctrico</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Transmisión</Label>
              <select name="transmission" required
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400">Descripción</Label>
            <textarea name="description" rows={4}
              placeholder="Descripción del vehículo..."
              className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-600 resize-none" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" id="isFeatured"
              className="rounded border-zinc-700" />
            <Label htmlFor="isFeatured" className="text-zinc-400 cursor-pointer">
              Destacar en la web
            </Label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/vehicles">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}
            className="bg-white text-zinc-900 hover:bg-zinc-200">
            {loading ? 'Creando...' : 'Crear y agregar imágenes →'}
          </Button>
        </div>
      </form>
    </div>
  )
}