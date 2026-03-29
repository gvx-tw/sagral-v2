'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { VehicleWithImages } from '@/types/catalog'

interface Props {
  vehicle: VehicleWithImages
}

export function VehicleCard({ vehicle }: Props) {
  // Registrar evento "view" al montar la card
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'view', vehicle_id: vehicle.id }),
    }).catch(() => {})
  }, [vehicle.id])

  const isSold = vehicle.isSold
  const mainImage = vehicle.images.find(img => img.isCover)?.url
    ?? vehicle.images[0]?.url
    ?? 'https://placehold.co/800x600/e5e7eb/9ca3af?text=Sin+foto'
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  return (
    <Link
      href={`/catalogo/${vehicle.id}`}
      className="group block bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:shadow-[#DDB43C]/15 hover:border-[#DDB43C]/40 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge VENDIDO */}
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-lg px-6 py-2 rounded-full rotate-[-8deg]">
              VENDIDO
            </span>
          </div>
        )}

        {/* Badge condición */}
        {vehicle.condition === 'nuevo' ? (
          <span className="absolute top-2 left-2">
            <span className="relative inline-flex">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDB43C] opacity-30" />
              <span className="relative text-xs font-semibold px-2 py-1 rounded-full bg-[#DDB43C] text-black">
                Nuevo
              </span>
            </span>
          </span>
        ) : (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 text-slate-600">
            Usado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {vehicle.year} · {vehicle.transmission === 'manual' ? 'Manual' : 'Automático'} · {vehicle.fuelType}
        </p>
        <p className="mt-3 font-bold text-[#DDB43C] text-xl">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}