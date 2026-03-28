// src/app/catalogo/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { VehicleGallery } from '@/components/ui/vehicle-detail/vehicle-gallery'
import { VehicleSpecs } from '@/components/ui/vehicle-detail/vehicle-specs'
import { VehicleLeadForm } from '@/components/ui/vehicle-detail/vehicle-lead-form'
import { RelatedVehicles } from '@/components/ui/vehicle-detail/related-vehicles'
import { AnalyticsTracker } from '@/components/ui/vehicle-detail/analytics-tracker'
import { VehicleDetail, RelatedVehicle } from '@/types/vehicle-detail'
import { VehicleSchema } from '@/components/seo/VehicleSchema' 

const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function getVehicle(id: string): Promise<VehicleDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/catalog/${id}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getRelated(id: string): Promise<RelatedVehicle[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/catalog/${id}/related`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.vehicles ?? []
  } catch {
    return []
  }
}

// ─── SEO dinámico ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const vehicle = await getVehicle(id)

  if (!vehicle) {
    return {
      title: 'Vehículo no encontrado — Sagral Automotores',
    }
  }

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  const formattedKm = new Intl.NumberFormat('es-AR').format(vehicle.km)
  const conditionLabel = vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado'

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
  const description = `${conditionLabel} · ${formattedPrice} · ${formattedKm} km · ${vehicle.fuelType}`
  const coverImage = vehicle.images.find((img) => img.isCover) ?? vehicle.images[0]

  return {
    title,
    description,
    alternates: {                                                 
      canonical: `https://www.sagralautomotores.com/catalogo/${id}`,
    },
    openGraph: {
      title,
      description,
      images: coverImage
        ? [{ url: coverImage.url, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverImage ? [coverImage.url] : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [vehicle, related] = await Promise.all([
    getVehicle(id),
    getRelated(id),
  ])

  if (!vehicle) notFound()

  const vehicleName = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`

  return (
    <>                                                
      <VehicleSchema                                  
        id={vehicle.id}
        brand={vehicle.brand}
        model={vehicle.model}
        year={vehicle.year}
        price={vehicle.price}
        currency={vehicle.currency ?? 'ARS'}
        km={vehicle.km}
        fuelType={vehicle.fuelType}
        transmission={vehicle.transmission}
        condition={vehicle.condition}
        color={vehicle.color}
        description={vehicle.description}
        images={vehicle.images}
      />
      <main className="min-h-screen bg-background">  
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/catalogo" className="hover:text-foreground transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {vehicleName}
            </span>
          </nav>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* Columna izquierda — Galería */}
            <div className="space-y-8">
              <VehicleGallery
                images={vehicle.images}
                vehicleName={vehicleName}
              />
            </div>

            {/* Columna derecha — Specs + Formulario */}
            <div className="space-y-6">
              <VehicleSpecs vehicle={vehicle} />
              <VehicleLeadForm
                vehicleId={vehicle.id}
                vehicleName={vehicleName}
              />
            </div>
          </div>

          {/* Relacionados */}
          <RelatedVehicles vehicles={related} />
        </div>

        {/* Analytics */}
        <AnalyticsTracker vehicleId={vehicle.id} />
      </main>
    </>                                               
  )
}