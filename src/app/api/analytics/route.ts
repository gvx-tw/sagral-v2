// src/app/api/analytics/route.ts
import { db } from '@/db'
import { analytics } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Acepta camelCase (eventType) y snake_case (event_type) para compatibilidad
    const eventType = body.eventType ?? body.event_type
    const vehicleId = body.vehicleId ?? body.vehicle_id ?? null
    const searchQuery = body.searchQuery ?? body.search_query ?? null

    if (!eventType) {
      return NextResponse.json({ error: 'eventType required' }, { status: 400 })
    }

    await db.insert(analytics).values({
      eventType,
      vehicleId,
      searchQuery,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}