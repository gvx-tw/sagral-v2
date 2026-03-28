'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RelatedVehicle } from '@/types/vehicle-detail'

interface RelatedVehiclesProps {
  vehicles: RelatedVehicle[]
}

export function RelatedVehicles({ vehicles }: RelatedVehiclesProps) {
  if (!vehicles.length) return null

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Vehículos relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const coverImage =
            v.images.find((img) => img.isCover)?.url ??
            v.images[0]?.url ??
            'https://placehold.co/800x600/e5e7eb/9ca3af?text=Sin+foto'

          const formattedPrice = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }).format(v.price)

          return (
            <Link
              key={v.id}
              href={`/catalogo/${v.id}`}
              className="group block rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={coverImage}
                  alt={`${v.brand} ${v.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {v.isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white font-bold text-sm px-3 py-1 rounded-full -rotate-6">
                      VENDIDO
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm">
                  {v.brand} {v.model} {v.year}
                </p>
                <p className="text-primary font-bold mt-1">{formattedPrice}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {v.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
                  {v.km != null && ` · ${v.km.toLocaleString('es-AR')} km`}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}