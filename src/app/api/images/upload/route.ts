import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { vehicleImages } from '@/db/schema'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { vehicleId, url, publicId, order } = body

  if (!vehicleId || !url || !publicId) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const [image] = await db
    .insert(vehicleImages)
    .values({
      vehicleId,
      url,
      publicId,
      order: order ?? 0,
      isCover: false,
    })
    .returning()

  return NextResponse.json(image, { status: 201 })
}