// src/components/vehicle-detail/vehicle-specs.tsx
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VehicleDetail } from '@/types/vehicle-detail'
import {
  Gauge,
  Fuel,
  Settings2,
  Palette,
  Calendar,
  Tag,
  MessageCircle,
} from 'lucide-react'

interface VehicleSpecsProps {
  vehicle: VehicleDetail
}

const FUEL_LABELS: Record<VehicleDetail['fuelType'], string> = {
  nafta: 'Nafta',
  diesel: 'Diesel',
  gnc: 'GNC',
  hibrido: 'Híbrido',
  electrico: 'Eléctrico',
}

const TRANSMISSION_LABELS: Record<VehicleDetail['transmission'], string> = {
  manual: 'Manual',
  automatica: 'Automática',
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const whatsappText = encodeURIComponent(
    `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  const formattedKm = new Intl.NumberFormat('es-AR').format(vehicle.km)

  const specs = [
    { icon: Calendar, label: 'Año', value: vehicle.year.toString() },
    { icon: Gauge, label: 'Kilometraje', value: `${formattedKm} km` },
    { icon: Fuel, label: 'Combustible', value: FUEL_LABELS[vehicle.fuelType] },
    { icon: Settings2, label: 'Transmisión', value: TRANSMISSION_LABELS[vehicle.transmission] },
    ...(vehicle.color ? [{ icon: Palette, label: 'Color', value: vehicle.color }] : []),
    { icon: Tag, label: 'Condición', value: vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado' },
  ]

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={vehicle.condition === 'nuevo' ? 'default' : 'secondary'}>
            {vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
          </Badge>
          {vehicle.isSold && (
            <Badge variant="destructive">Vendido</Badge>
          )}
          {vehicle.isFeatured && (
            <Badge variant="outline">Destacado</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {vehicle.brand} {vehicle.model}
        </h1>

        <p className="text-muted-foreground text-lg">{vehicle.year}</p>

        <p className="text-4xl font-extrabold text-primary">{formattedPrice}</p>
      </div>

      <Separator />

      {/* Grid de specs */}
      <div className="grid grid-cols-2 gap-4">
        {specs.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-muted">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-medium text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Descripción */}
      {vehicle.description && (
        <div className="space-y-2">
          <h2 className="font-semibold text-base">Descripción</h2>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {vehicle.description}
          </p>
        </div>
      )}

      {/* Botón WhatsApp */}
      {!vehicle.isSold && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="whatsapp-cta"
          className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg shadow-green-500/20"
        >
          <MessageCircle className="w-5 h-5" />
          Consultar por WhatsApp
        </a>
      )}

      {vehicle.isSold && (
        <div className="w-full bg-muted text-muted-foreground font-semibold py-4 px-6 rounded-xl text-center text-base">
          Este vehículo ya fue vendido
        </div>
      )}
    </div>
  )
}