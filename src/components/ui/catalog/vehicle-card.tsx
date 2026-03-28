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
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
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
        <span className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-gray-700">
          {vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {vehicle.year} · {vehicle.transmission === 'manual' ? 'Manual' : 'Automático'} · {vehicle.fuelType}
        </p>
        <p className="mt-3 font-bold text-blue-600 text-xl">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}