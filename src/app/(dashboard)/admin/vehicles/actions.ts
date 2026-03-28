'use server'
import { db } from '@/db'
import { vehicles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { writeLog } from '@/lib/admin-log'
import { revalidatePath } from 'next/cache'
import { syncVehicleToSheets } from '@/lib/google-sheets'

// ─── Helper: mapear vehículo de DB a formato Sheets ──────────────────────────

function toSheetsFormat(vehicle: {
  id: string
  brand: string
  model: string
  year: number
  price: number
  isSold: boolean
}) {
  return {
    id: vehicle.id,
    marca: vehicle.brand,
    modelo: vehicle.model,
    anio: vehicle.year,
    precio: vehicle.price,
    estado: vehicle.isSold ? 'VENDIDO' : 'Activo',
  }
}

// ─── Crear vehículo ───────────────────────────────────────────────────────────

export async function createVehicle(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  const data = {
    title: `${formData.get('brand')} ${formData.get('model')} ${formData.get('year')}`,
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    price: parseInt(formData.get('price') as string),
    currency: (formData.get('currency') as string) || 'USD',
    km: parseInt(formData.get('km') as string) || 0,
    fuelType: formData.get('fuelType') as 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico',
    transmission: formData.get('transmission') as 'manual' | 'automatica',
    condition: formData.get('condition') as 'nuevo' | 'usado',
    color: (formData.get('color') as string) || null,
    description: (formData.get('description') as string) || null,
    isFeatured: formData.get('isFeatured') === 'on',
  }

  const [vehicle] = await db.insert(vehicles).values(data).returning()

  await writeLog({
    userId: session.user.id!,
    action: 'create',
    entity: 'vehicle',
    entityId: vehicle.id,
    details: vehicle.title,
  })

  // Sync Sheets — no bloquea si falla
  let sheetsSync = true
  try {
    await syncVehicleToSheets(toSheetsFormat(vehicle), 'create')
  } catch (error) {
    console.error('[Sheets] Error al crear fila:', error)
    sheetsSync = false
  }

  revalidatePath('/admin/vehicles')
  return { ...vehicle, sheetsSync }
}

// ─── Editar vehículo ──────────────────────────────────────────────────────────

export async function updateVehicle(id: string, formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  const data = {
    title: `${formData.get('brand')} ${formData.get('model')} ${formData.get('year')}`,
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    price: parseInt(formData.get('price') as string),
    currency: (formData.get('currency') as string) || 'USD',
    km: parseInt(formData.get('km') as string) || 0,
    fuelType: formData.get('fuelType') as 'nafta' | 'diesel' | 'gnc' | 'hibrido' | 'electrico',
    transmission: formData.get('transmission') as 'manual' | 'automatica',
    condition: formData.get('condition') as 'nuevo' | 'usado',
    color: (formData.get('color') as string) || null,
    description: (formData.get('description') as string) || null,
    isFeatured: formData.get('isFeatured') === 'on',
    updatedAt: new Date(),
  }

  await db.update(vehicles).set(data).where(eq(vehicles.id, id))

  await writeLog({
    userId: session.user.id!,
    action: 'edit',
    entity: 'vehicle',
    entityId: id,
    details: data.title,
  })

  // Sync Sheets — no bloquea si falla
  let sheetsSync = true
  try {
    await syncVehicleToSheets(
      toSheetsFormat({ id, isSold: false, ...data }),
      'update'
    )
  } catch (error) {
    console.error('[Sheets] Error al actualizar fila:', error)
    sheetsSync = false
  }

  revalidatePath('/admin/vehicles')
  revalidatePath(`/admin/vehicles/${id}/edit`)
  return { sheetsSync }
}

// ─── Marcar vendido / desmarcar ───────────────────────────────────────────────

export async function toggleSold(id: string, isSold: boolean) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  const [vehicle] = await db
    .update(vehicles)
    .set({ isSold: !isSold, updatedAt: new Date() })
    .where(eq(vehicles.id, id))
    .returning()

  await writeLog({
    userId: session.user.id!,
    action: isSold ? 'unsold' : 'sold',
    entity: 'vehicle',
    entityId: id,
  })

  // Sync Sheets — no bloquea si falla
  let sheetsSync = true
  try {
    await syncVehicleToSheets(toSheetsFormat(vehicle), 'update')
  } catch (error) {
    console.error('[Sheets] Error al actualizar estado:', error)
    sheetsSync = false
  }

  revalidatePath('/admin/vehicles')
  return { sheetsSync }
}

// ─── Eliminar vehículo ────────────────────────────────────────────────────────

export async function deleteVehicle(id: string) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  await db.delete(vehicles).where(eq(vehicles.id, id))

  await writeLog({
    userId: session.user.id!,
    action: 'delete',
    entity: 'vehicle',
    entityId: id,
  })

  // Sync Sheets — no bloquea si falla
  let sheetsSync = true
  try {
    await syncVehicleToSheets({ id, marca: '', modelo: '', anio: 0, precio: 0, estado: '' }, 'delete')
  } catch (error) {
    console.error('[Sheets] Error al eliminar fila:', error)
    sheetsSync = false
  }

  revalidatePath('/admin/vehicles')
  return { sheetsSync }
}