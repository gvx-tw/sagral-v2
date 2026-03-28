import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicleImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@/auth'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  // 1. Buscar la imagen en BD para obtener el public_id
  const [image] = await db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.id, id))

  if (!image) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
  }

  // 2. Eliminar en Cloudinary
  await cloudinary.uploader.destroy(image.publicId)

  // 3. Eliminar en BD
  await db.delete(vehicleImages).where(eq(vehicleImages.id, id))

  return NextResponse.json({ success: true })
}