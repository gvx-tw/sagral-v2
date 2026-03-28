import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicles, vehicleImages } from '@/db/schema'
import { and, asc, desc, eq, gte, ilike, lte, or } from 'drizzle-orm'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page    = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const brand   = searchParams.get('brand') || ''
  const condition    = searchParams.get('condition') || ''
  const fuelType     = searchParams.get('fuelType') || ''
  const transmission = searchParams.get('transmission') || ''
  const year_from  = searchParams.get('year_from') || ''
  const year_to    = searchParams.get('year_to') || ''
  const price_from = searchParams.get('price_from') || ''
  const price_to   = searchParams.get('price_to') || ''
  const search     = searchParams.get('search') || ''

  try {
    const filters = []

    if (brand)   filters.push(ilike(vehicles.brand, brand))
    if (condition) filters.push(eq(vehicles.condition, condition as 'nuevo' | 'usado'))
    if (fuelType)  filters.push(eq(vehicles.fuelType, fuelType as 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico'))
    if (transmission) filters.push(eq(vehicles.transmission, transmission as 'manual' | 'automatica'))
    if (year_from) filters.push(gte(vehicles.year, parseInt(year_from)))
    if (year_to)   filters.push(lte(vehicles.year, parseInt(year_to)))
    if (price_from) filters.push(gte(vehicles.price, parseInt(price_from)))
    if (price_to)   filters.push(lte(vehicles.price, parseInt(price_to)))
    if (search) {
      filters.push(
        or(
          ilike(vehicles.brand, `%${search}%`),
          ilike(vehicles.model, `%${search}%`),
          ilike(vehicles.description, `%${search}%`)
        )
      )
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined
    const offset = (page - 1) * PAGE_SIZE

    // Vehículos paginados con imágenes (join)
    const vehiclesResult = await db
      .select()
      .from(vehicles)
      .leftJoin(vehicleImages, eq(vehicleImages.vehicleId, vehicles.id))
      .where(whereClause)
      .orderBy(desc(vehicles.isFeatured), desc(vehicles.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset)

    // Total para paginación
    const allIds = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(whereClause)

    // Marcas únicas
    const brandsResult = await db
      .selectDistinct({ brand: vehicles.brand })
      .from(vehicles)
      .orderBy(asc(vehicles.brand))

    // Agrupar imágenes por vehículo
    const grouped = new Map<string, { vehicle: typeof vehicles.$inferSelect, images: typeof vehicleImages.$inferSelect[] }>()

    for (const row of vehiclesResult) {
      const v = row.vehicles
      if (!grouped.has(v.id)) {
        grouped.set(v.id, { vehicle: v, images: [] })
      }
      if (row.vehicle_images) {
        grouped.get(v.id)!.images.push(row.vehicle_images)
      }
    }

    const vehiclesWithImages = Array.from(grouped.values()).map(({ vehicle, images }) => ({
      ...vehicle,
      images: images.sort((a, b) => a.order - b.order),
    }))

    return NextResponse.json({
      vehicles: vehiclesWithImages,
      total: allIds.length,
      page,
      totalPages: Math.ceil(allIds.length / PAGE_SIZE),
      brands: brandsResult.map(r => r.brand),
    })
  } catch (error) {
    console.error('[CATALOG API ERROR]', error)
    return NextResponse.json({ error: 'Error al cargar el catálogo' }, { status: 500 })
  }
}