import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicleImages } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { images } = body as { images: { id: string; order: number }[] }

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  // Actualizar cada imagen en paralelo
  await Promise.all(
    images.map(({ id, order }) =>
      db
        .update(vehicleImages)
        .set({ order })
        .where(eq(vehicleImages.id, id))
    )
  )

  return NextResponse.json({ success: true })
}