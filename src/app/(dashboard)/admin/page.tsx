import { getDashboardMetrics } from './dashboard-metrics'
import { Car, TrendingUp, MessageSquare, Clock, Eye, Search } from 'lucide-react'

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics()

  const cards = [
    {
      label: 'Total vehículos',
      value: metrics.totalVehicles,
      icon: Car,
      sub: `${metrics.soldVehicles} vendidos`,
    },
    {
      label: 'Vistas este mes',
      value: metrics.viewsThisMonth,
      icon: Eye,
      sub: 'Visitas a vehículos',
    },
    {
      label: 'Leads este mes',
      value: metrics.leadsThisMonth,
      icon: TrendingUp,
      sub: 'Consultas recibidas',
    },
    {
      label: 'Leads pendientes',
      value: metrics.pendingLeads,
      icon: Clock,
      sub: 'Sin atender',
      alert: metrics.pendingLeads > 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-400 text-sm">Resumen del negocio</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, sub, alert }) => (
          <div
            key={label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                {label}
              </span>
              <Icon className={`w-4 h-4 ${alert ? 'text-amber-400' : 'text-zinc-600'}`} />
            </div>
            <p className={`text-3xl font-semibold ${alert ? 'text-amber-400' : 'text-white'}`}>
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top vehículos más vistos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-200">
              Top vehículos más vistos
            </h2>
          </div>
          {metrics.topVehicles.length === 0 ? (
            <p className="text-zinc-600 text-sm">Sin datos todavía</p>
          ) : (
            <div className="space-y-3">
              {metrics.topVehicles.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-600 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{v.title}</p>
                    <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-500 rounded-full"
                        style={{
                          width: `${Math.round((v.views / (metrics.topVehicles[0]?.views || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">
                    {v.views.toLocaleString()} vistas
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top búsquedas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-200">
              Búsquedas más frecuentes
            </h2>
          </div>
          {metrics.topSearches.length === 0 ? (
            <p className="text-zinc-600 text-sm">Sin datos todavía</p>
          ) : (
            <div className="space-y-2">
              {metrics.topSearches.map((s) => (
                <div key={s.query} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 truncate">{s.query}</span>
                  <span className="text-xs text-zinc-500 shrink-0 ml-4">
                    {s.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}