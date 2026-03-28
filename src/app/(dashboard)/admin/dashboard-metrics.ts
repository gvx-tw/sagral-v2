import { db } from '@/db'
import { analytics, vehicles, leads } from '@/db/schema'
import { count, eq, gte, and, sql } from 'drizzle-orm'

export async function getDashboardMetrics() {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
        totalVehicles,
        soldVehicles,
        leadsThisMonth,
        pendingLeads,
        topVehicles,
        topSearches,
        viewsThisMonth,
    ] = await Promise.all([

        // Total vehículos
        db.select({ count: count() }).from(vehicles),

        // Vehículos vendidos
        db.select({ count: count() }).from(vehicles).where(eq(vehicles.isSold, true)),

        // Leads del mes
        db.select({ count: count() }).from(leads)
            .where(gte(leads.createdAt, firstOfMonth)),

        // Leads sin atender
        db.select({ count: count() }).from(leads)
            .where(eq(leads.isAttended, false)),

        // Top 5 vehículos más vistos
        db.select({
            vehicleId: analytics.vehicleId,
            views: count(),
        })
            .from(analytics)
            .where(eq(analytics.eventType, 'view'))
            .groupBy(analytics.vehicleId)
            .orderBy(sql`count(*) desc`)
            .limit(5),

        // Top 10 búsquedas
        db.select({
            query: analytics.searchQuery,
            total: count(),
        })
            .from(analytics)
            .where(eq(analytics.eventType, 'search'))
            .groupBy(analytics.searchQuery)
            .orderBy(sql`count(*) desc`)
            .limit(10),

        // Vistas del mes
        db.select({ count: count() }).from(analytics)
            .where(
                and(
                    eq(analytics.eventType, 'view'),
                    gte(analytics.createdAt, firstOfMonth)
                )
            ),
    ])

    // Obtener títulos de los top vehículos
    const topVehicleIds = topVehicles
        .map(v => v.vehicleId)
        .filter(Boolean) as string[]

    const topVehiclesWithTitles = await Promise.all(
        topVehicleIds.map(async (id) => {
            const [vehicle] = await db
                .select({ id: vehicles.id, title: vehicles.title })
                .from(vehicles)
                .where(eq(vehicles.id, id))
                .limit(1)
            const views = topVehicles.find(v => v.vehicleId === id)?.views ?? 0
            return { id, title: vehicle?.title ?? 'Vehículo eliminado', views }
        })
    )

    return {
        totalVehicles: totalVehicles[0]?.count ?? 0,
        soldVehicles: soldVehicles[0]?.count ?? 0,
        leadsThisMonth: leadsThisMonth[0]?.count ?? 0,
        pendingLeads: pendingLeads[0]?.count ?? 0,
        viewsThisMonth: viewsThisMonth[0]?.count ?? 0,
        topVehicles: topVehiclesWithTitles,
        topSearches: topSearches
            .filter(s => s.query)
            .map(s => ({ query: s.query!, total: s.total })),
    }
}