import Link from 'next/link'
import { db } from '@/db'
import { leads, vehicles } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Badge } from '@/components/ui/badge'
import { LeadActions } from './lead-actions'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams

  const list = await db
    .select({
      id: leads.id,
      name: leads.name,
      phone: leads.phone,
      email: leads.email,
      message: leads.message,
      isAttended: leads.isAttended,
      createdAt: leads.createdAt,
      vehicleTitle: vehicles.title,
    })
    .from(leads)
    .leftJoin(vehicles, eq(leads.vehicleId, vehicles.id))
    .orderBy(desc(leads.createdAt))

  const filtered =
    filter === 'pending'
      ? list.filter((l) => !l.isAttended)
      : filter === 'attended'
      ? list.filter((l) => l.isAttended)
      : list

  const pendingCount = list.filter((l) => !l.isAttended).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Leads</h1>
          <p className="text-zinc-400 text-sm">
            {list.length} consultas · {pendingCount} sin atender
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              !filter
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Todos
          </Link>
          <Link
            href="/admin/leads?filter=pending"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === 'pending'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Pendientes
          </Link>
          <Link
            href="/admin/leads?filter=attended"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === 'attended'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Atendidos
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Contacto</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Vehículo</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Mensaje</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Estado</th>
              <th className="text-right px-4 py-3 text-zinc-500 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600">
                  No hay leads para mostrar
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr
                  key={lead.id.toString()}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-zinc-100 font-medium">{lead.name}</p>
                    <p className="text-zinc-500 text-xs">
                      {lead.phone ?? lead.email ?? '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 text-xs">
                    {lead.vehicleTitle ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs max-w-xs truncate">
                    {lead.message ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    {lead.isAttended ? (
                      <Badge className="bg-zinc-700 text-zinc-300 text-xs">
                        Atendido
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-900/50 text-amber-400 border-amber-800 text-xs">
                        Pendiente
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <LeadActions id={lead.id} isAttended={lead.isAttended} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}