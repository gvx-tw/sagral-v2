import { db } from '@/db'
import { vehicles, vehicleImages } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { EditVehicleForm } from './edit-form'

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1)

  if (!vehicle) notFound()

  // Cargar imágenes existentes ordenadas
  const images = await db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, id))
    .orderBy(asc(vehicleImages.order))

  return (
    <EditVehicleForm
      vehicle={vehicle}
      initialImages={images.map((img) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        order: img.order,
        isCover: img.isCover,
      }))}
    />
  )
}