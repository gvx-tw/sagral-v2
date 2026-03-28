import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicles, vehicleImages } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // UUID básico: 36 caracteres
 const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const vehicleResult = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1)

    if (!vehicleResult.length) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
    }

    const imagesResult = await db
      .select()
      .from(vehicleImages)
      .where(eq(vehicleImages.vehicleId, id))
      .orderBy(vehicleImages.order)

    return NextResponse.json({
      ...vehicleResult[0],
      images: imagesResult,
    })
  } catch (error) {
    console.error('[VEHICLE DETAIL ERROR]', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}