// src/app/api/catalog/[id]/related/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicles, vehicleImages } from '@/db/schema'
import { eq, ne, or, and, between, sql } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Buscar el vehículo actual para obtener marca y precio
    const current = await db
      .select({
        brand: vehicles.brand,
        price: vehicles.price,
      })
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1)

    if (!current.length) {
      return NextResponse.json({ vehicles: [] })
    }

    const { brand, price } = current[0]
    const priceMargin = price * 0.3 // ±30% del precio

    // Buscar relacionados: misma marca O rango de precio, excluyendo el actual
    const related = await db
      .select({
        id: vehicles.id,
        brand: vehicles.brand,
        model: vehicles.model,
        year: vehicles.year,
        price: vehicles.price,
        kilometers: vehicles.km,
        condition: vehicles.condition,
        isSold: vehicles.isSold,
      })
      .from(vehicles)
      .where(
        and(
          ne(vehicles.id, id),
          or(
            eq(vehicles.brand, brand),
            between(vehicles.price, price - priceMargin, price + priceMargin)
          )
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(3)

    // Buscar imagen de portada para cada relacionado
    const relatedWithImages = await Promise.all(
      related.map(async (v) => {
        const images = await db
          .select()
          .from(vehicleImages)
          .where(eq(vehicleImages.vehicleId, v.id))
          .orderBy(vehicleImages.order)
          .limit(3)

        return { ...v, images }
      })
    )

    return NextResponse.json({ vehicles: relatedWithImages })
  } catch (error) {
    console.error('[RELATED VEHICLES ERROR]', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}