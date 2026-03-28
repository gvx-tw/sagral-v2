// src/app/catalogo/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

async function getVehicle(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/catalog/${id}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicle = await getVehicle(id)

  // ── Fallback si no encuentra el vehículo ──────────────────────────────────
  if (!vehicle) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111',
          }}
        >
          <span style={{ color: '#fff', fontSize: 48 }}>Sagral Automotores</span>
        </div>
      ),
      { ...size }
    )
  }

  const coverImage = vehicle.images.find((img: { isCover: boolean }) => img.isCover)
    ?? vehicle.images[0]

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(vehicle.price)

  const formattedKm = new Intl.NumberFormat('es-AR').format(vehicle.km)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Foto del vehículo como fondo */}
        {coverImage && (
          <img
            src={coverImage.url}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.45,
            }}
          />
        )}

        {/* Gradiente sobre la foto */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Contenido */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 72,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Marca */}
          <span
            style={{
              color: '#a3a3a3',
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {vehicle.brand}
          </span>

          {/* Modelo + Año */}
          <span
            style={{
              color: '#ffffff',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {vehicle.model} {vehicle.year}
          </span>

          {/* KM + Combustible */}
          <span
            style={{
              color: '#d4d4d4',
              fontSize: 28,
              fontWeight: 400,
              marginTop: 4,
            }}
          >
            {formattedKm} km · {vehicle.fuelType} · {vehicle.transmission}
          </span>

          {/* Precio */}
          <span
            style={{
              color: '#facc15',
              fontSize: 44,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {formattedPrice}
          </span>

          {/* Dominio */}
          <span
            style={{
              color: '#737373',
              fontSize: 22,
              marginTop: 4,
            }}
          >
            sagralautomotores.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}