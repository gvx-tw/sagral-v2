import { db } from '@/db'
import { vehicles, vehicleImages, testimonials, siteConfig } from '@/db/schema'
import { eq, inArray, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// Inserta transformaciones Cloudinary sin romper la URL original
// El formato en BD es siempre: https://res.cloudinary.com/{cloud}/image/upload/{public_id}.ext
function withCloudinaryTransform(url: string): string {
  return url.replace('/upload/', '/upload/w_400,h_300,c_fill,f_auto,q_auto/')
}

export async function GET() {
  try {
    const [featuredVehicles, visibleTestimonials, configList] = await Promise.all([
      db
        .select({
          id: vehicles.id,
          brand: vehicles.brand,
          model: vehicles.model,
          year: vehicles.year,
          price: vehicles.price,
          currency: vehicles.currency,
          mileage: vehicles.km,
          fuel_type: vehicles.fuelType,
          transmission: vehicles.transmission,
          condition: vehicles.condition,
          is_featured: vehicles.isFeatured,
        })
        .from(vehicles)
        .where(eq(vehicles.isFeatured, true))
        .limit(3),

      db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isVisible, true)),

      db
        .select({ key: siteConfig.key, value: siteConfig.value })
        .from(siteConfig),
    ])

    // Obtener imágenes de los vehículos destacados
    // Misma estrategia que /api/catalog — 2 queries + agrupación en JS
    let vehiclesWithImages = featuredVehicles.map(v => ({ ...v, main_image: null as string | null }))

    if (featuredVehicles.length > 0) {
      const ids = featuredVehicles.map(v => v.id)
      const images = await db
        .select()
        .from(vehicleImages)
        .where(inArray(vehicleImages.vehicleId, ids))
        .orderBy(desc(vehicleImages.isCover), vehicleImages.order)

      // Agrupar por vehicleId y tomar la primera (cover si existe, si no la primera por orden)
      const coverByVehicle = new Map<string, string>()
      for (const img of images) {
        if (!coverByVehicle.has(img.vehicleId)) {
          coverByVehicle.set(img.vehicleId, img.url)
        }
      }

      vehiclesWithImages = featuredVehicles.map(v => ({
        ...v,
        main_image: coverByVehicle.has(v.id)
          ? withCloudinaryTransform(coverByVehicle.get(v.id)!)
          : null,
      }))
    }

    const config = configList.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    return NextResponse.json({ vehicles: vehiclesWithImages, testimonials: visibleTestimonials, config })
  } catch (error) {
    console.error('Landing API error:', error)
    return NextResponse.json({ error: 'Error loading data' }, { status: 500 })
  }
}