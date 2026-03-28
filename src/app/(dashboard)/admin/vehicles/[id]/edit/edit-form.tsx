'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateVehicle } from '../../actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Vehicle } from '@/db/schema'
import { ImageUploader } from '@/components/ui/admin/image-uploader'
import { ImageManager, type ManagedImage } from '@/components/ui/admin/image-manager'
import { toast } from 'sonner'

interface EditVehicleFormProps {
  vehicle: Vehicle
  initialImages: ManagedImage[]
}

export function EditVehicleForm({ vehicle, initialImages }: EditVehicleFormProps) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<ManagedImage[]>(initialImages)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateVehicle(vehicle.id, formData)
    if (!result.sheetsSync) {
      toast.warning('Cambios guardados. No se pudo sincronizar con Google Sheets.')
    }
    router.push('/admin/vehicles')
  }

  function handleUploadSuccess(newImage: ManagedImage) {
    setImages((prev) => [...prev, newImage])
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
          <h1 className="text-2xl font-semibold text-white">Editar vehículo</h1>
          <p className="text-zinc-400 text-sm">{vehicle.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Datos principales ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
            Datos principales
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Marca</Label>
              <Input name="brand" required defaultValue={vehicle.brand}
                className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Modelo</Label>
              <Input name="model" required defaultValue={vehicle.model}
                className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Año</Label>
              <Input name="year" type="number" required defaultValue={vehicle.year}
                min="1990" max="2030" className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-zinc-400">Precio</Label>
              <div className="flex gap-2">
                <select name="currency" defaultValue={vehicle.currency ?? 'USD'}
                  className="h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm w-24">
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
                <Input name="price" type="number" required defaultValue={vehicle.price}
                  min="0" className="bg-zinc-800 border-zinc-700 text-white flex-1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Color</Label>
              <Input name="color" defaultValue={vehicle.color ?? ''}
                className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Condición</Label>
              <select name="condition" required defaultValue={vehicle.condition}
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                <option value="usado">Usado</option>
                <option value="nuevo">Nuevo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Combustible</Label>
              <select name="fuelType" required defaultValue={vehicle.fuelType}
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
              <select name="transmission" required defaultValue={vehicle.transmission}
                className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400">Descripción</Label>
            <textarea name="description" rows={4} defaultValue={vehicle.description ?? ''}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm resize-none" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" id="isFeatured"
              defaultChecked={vehicle.isFeatured} className="rounded border-zinc-700" />
            <Label htmlFor="isFeatured" className="text-zinc-400 cursor-pointer">
              Destacar en la web
            </Label>
          </div>
        </div>

        {/* ── Imágenes ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
              Imágenes
            </h2>
            <span className="text-xs text-zinc-500">{images.length}/10</span>
          </div>

          <ImageManager images={images} onChange={setImages} />

          <ImageUploader
            vehicleId={vehicle.id}
            currentCount={images.length}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/vehicles">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}
            className="bg-white text-zinc-900 hover:bg-zinc-200">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}