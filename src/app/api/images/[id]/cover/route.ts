import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicleImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  // 1. Buscar la imagen para obtener vehicleId
  const [image] = await db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.id, id))

  if (!image) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
  }

  // 2. Quitar is_cover de todas las imágenes del vehículo
  await db
    .update(vehicleImages)
    .set({ isCover: false })
    .where(eq(vehicleImages.vehicleId, image.vehicleId))

  // 3. Marcar esta como cover
  const [updated] = await db
    .update(vehicleImages)
    .set({ isCover: true })
    .where(eq(vehicleImages.id, id))
    .returning()

  return NextResponse.json(updated)
}
