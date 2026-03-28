import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { vehicles } from '@/db/schema'
import { syncAllVehiclesToSheets } from '@/lib/google-sheets'

export async function POST(req: Request) {
  // Solo admins autenticados
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Traer todos los vehículos de Neon
    const allVehicles = await db.select().from(vehicles)

    // Mapear al formato de Sheets
    const sheetsData = allVehicles.map((v) => ({
      id: v.id,
      marca: v.brand,
      modelo: v.model,
      anio: v.year,
      precio: v.price,
      estado: v.isSold ? 'VENDIDO' : 'Activo',
    }))

    // Sync bulk
    const result = await syncAllVehiclesToSheets(sheetsData)

    return NextResponse.json({
      ok: true,
      synced: result.synced,
      message: `${result.synced} vehículos sincronizados correctamente.`,
    })
  } catch (error) {
    console.error('[sync-sheets]', error)
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}