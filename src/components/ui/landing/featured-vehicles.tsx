import type { FeaturedVehicle } from '@/types/landing'
import Image from 'next/image'
import Link from 'next/link'
import { Car } from 'lucide-react'

interface FeaturedVehiclesProps {
  vehicles: FeaturedVehicle[]
}

export function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (!vehicles.length) return null

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vehículos Destacados
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Selección especial de los mejores autos disponibles en nuestro stock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            Ver todo el catálogo →
          </Link>
        </div>
      </div>
    </section>
  )
}

function VehicleCard({ vehicle }: { vehicle: FeaturedVehicle }) {
  const price = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: vehicle.currency === 'USD' ? 'USD' : 'ARS',
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  return (
    <Link href={`/catalogo/${vehicle.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1">
        <div className="relative h-52">
          {vehicle.main_image ? (
            <Image
              src={vehicle.main_image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-700 to-slate-900">
              <Car className="w-12 h-12 text-slate-400" />
              <span className="text-slate-500 text-xs mt-2">Sin foto</span>
            </div>
          )}
          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
            {vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {vehicle.year} · {vehicle.fuel_type} · {vehicle.transmission}
            {vehicle.mileage > 0 && ` · ${vehicle.mileage.toLocaleString('es-AR')} km`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              {price}
            </span>
            <span className="text-sm text-blue-600 font-medium group-hover:underline">
              Ver más →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}