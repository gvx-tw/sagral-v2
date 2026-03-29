'use client'

import type { FeaturedVehicle } from '@/types/landing'
import Image from 'next/image'
import Link from 'next/link'
import { Car } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

interface FeaturedVehiclesProps {
  vehicles: FeaturedVehicle[]
}

export function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  const { ref, inView } = useInView()
  if (!vehicles.length) return null

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-[#f8f8f8] transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[#DDB43C] text-sm font-semibold tracking-widest uppercase mb-3">
            Stock disponible
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Vehículos Destacados
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-[#DDB43C]/40" />
            <div className="w-12 h-1 bg-[#DDB43C] rounded-full" />
            <div className="w-8 h-px bg-[#DDB43C]/40" />
          </div>
          <p className="text-[#666666] max-w-xl mx-auto mt-5">
            Selección especial de los mejores autos disponibles en nuestro stock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/catalogo"
            className="inline-block px-9 py-3.5 border-2 border-[#DDB43C] text-[#DDB43C] font-bold rounded-xl hover:bg-[#DDB43C] hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-[#DDB43C]/25 hover:scale-105"
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
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#DDB43C]/10 transition-all duration-400 border border-gray-100 hover:border-[#DDB43C]/25 group-hover:-translate-y-1.5">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {vehicle.main_image ? (
            <Image
              src={vehicle.main_image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-linear-to-br from-slate-700 to-slate-900">
              <Car className="w-12 h-12 text-slate-400" />
              <span className="text-slate-500 text-xs mt-2">Sin foto</span>
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Condition badge */}
          {vehicle.condition === 'nuevo' ? (
            <span className="absolute top-3 left-3">
              <span className="relative inline-flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDB43C] opacity-30" />
                <span className="relative px-2.5 py-1 bg-[#DDB43C] text-black text-xs font-bold rounded-lg shadow-md">
                  Nuevo
                </span>
              </span>
            </span>
          ) : (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-slate-700 text-xs font-semibold rounded-lg shadow-md">
              Usado
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Gold accent line — slides in on hover */}
          <div className="h-0.5 w-0 group-hover:w-full bg-linear-to-r from-[#DDB43C] to-[#F0C84A] transition-all duration-500 rounded-full mb-4" />
          <h3 className="text-lg font-bold text-[#111111] mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-[#666666] mb-3">
            {vehicle.year} · {vehicle.fuel_type} · {vehicle.transmission}
            {vehicle.mileage > 0 && ` · ${vehicle.mileage.toLocaleString('es-AR')} km`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#DDB43C]">
              {price}
            </span>
            <span className="text-sm text-[#DDB43C] font-semibold group-hover:underline transition-all duration-200">
              Ver más →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}