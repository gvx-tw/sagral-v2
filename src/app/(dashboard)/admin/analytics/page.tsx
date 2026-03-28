import { db } from '@/db'
import { analytics, vehicles } from '@/db/schema'
import { count, eq, gte, and, sql, desc } from 'drizzle-orm'

export default async function AnalyticsPage() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    topVehicles,
    topSearches,
    whatsappClicks,
    viewsPerDay,
  ] = await Promise.all([
    // Top 10 vehículos más vistos
    db
      .select({ vehicleId: analytics.vehicleId, views: count() })
      .from(analytics)
      .where(eq(analytics.eventType, 'view'))
      .groupBy(analytics.vehicleId)
      .orderBy(sql`count(*) desc`)
      .limit(10),

    // Top 15 búsquedas
    db
      .select({ query: analytics.searchQuery, total: count() })
      .from(analytics)
      .where(eq(analytics.eventType, 'search'))
      .groupBy(analytics.searchQuery)
      .orderBy(sql`count(*) desc`)
      .limit(15),

    // WhatsApp clicks por vehículo
    db
      .select({ vehicleId: analytics.vehicleId, clicks: count() })
      .from(analytics)
      .where(eq(analytics.eventType, 'whatsapp_click'))
      .groupBy(analytics.vehicleId)
      .orderBy(sql`count(*) desc`)
      .limit(10),

    // Vistas por día últimos 30 días
    db
      .select({
        day: sql<string>`DATE(created_at)`,
        total: count(),
      })
      .from(analytics)
      .where(
        and(
          eq(analytics.eventType, 'view'),
          gte(analytics.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at) asc`),
  ])

  // Resolver títulos de vehículos
  const vehicleIds = [
    ...new Set([
      ...topVehicles.map(v => v.vehicleId),
      ...whatsappClicks.map(v => v.vehicleId),
    ].filter(Boolean) as string[])
  ]

  const vehicleTitles: Record<string, string> = {}
  await Promise.all(
    vehicleIds.map(async (id) => {
      const [v] = await db
        .select({ id: vehicles.id, title: vehicles.title })
        .from(vehicles)
        .where(eq(vehicles.id, id))
        .limit(1)
      vehicleTitles[id] = v?.title ?? 'Vehículo eliminado'
    })
  )

  const maxViews = topVehicles[0]?.views ?? 1
  const maxClicks = whatsappClicks[0]?.clicks ?? 1
  const maxSearches = topSearches[0]?.total ?? 1
  const maxDay = Math.max(...viewsPerDay.map(d => d.total), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Analytics</h1>
        <p className="text-zinc-400 text-sm">Datos reales desde la base de datos</p>
      </div>

      {/* Vistas por día */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">
          Vistas por día — últimos 30 días
        </h2>
        {viewsPerDay.length === 0 ? (
          <p className="text-zinc-600 text-sm">Sin datos</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {viewsPerDay.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-zinc-700 hover:bg-zinc-500 rounded-sm transition-colors relative"
                  style={{ height: `${Math.round((d.total / maxDay) * 100)}%` }}
                  title={`${d.day}: ${d.total} vistas`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top vehículos más vistos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">
            Top vehículos más vistos
          </h2>
          <div className="space-y-3">
            {topVehicles.map((v, i) => (
              <div key={v.vehicleId ?? i} className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {v.vehicleId ? vehicleTitles[v.vehicleId] : 'Sin vehículo'}
                  </p>
                  <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-500 rounded-full"
                      style={{ width: `${Math.round((v.views / maxViews) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-zinc-400 shrink-0">
                  {v.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp clicks */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-zinc-300 mb-4">
            Clics WhatsApp por vehículo
          </h2>
          {whatsappClicks.length === 0 ? (
            <p className="text-zinc-600 text-sm">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {whatsappClicks.map((v, i) => (
                <div key={v.vehicleId ?? i} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-600 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">
                      {v.vehicleId ? vehicleTitles[v.vehicleId] : 'Sin vehículo'}
                    </p>
                    <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${Math.round((v.clicks / maxClicks) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">
                    {v.clicks.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top búsquedas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-medium text-zinc-300 mb-4">
          Búsquedas más frecuentes
        </h2>
        {topSearches.length === 0 ? (
          <p className="text-zinc-600 text-sm">Sin datos</p>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {topSearches.filter(s => s.query).map((s) => (
              <div
                key={s.query}
                className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-zinc-300 truncate">{s.query}</span>
                <span className="text-xs text-zinc-500 shrink-0 ml-2">
                  {s.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}