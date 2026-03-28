import { db } from '@/db'
import { adminLogs, users } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>
}) {
  const { action } = await searchParams

  const list = await db
    .select({
      id: adminLogs.id,
      action: adminLogs.action,
      entity: adminLogs.entity,
      entityId: adminLogs.entityId,
      details: adminLogs.details,
      createdAt: adminLogs.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(adminLogs)
    .leftJoin(users, eq(adminLogs.userId, users.id))
    .orderBy(desc(adminLogs.createdAt))

  const filtered = action ? list.filter((l) => l.action === action) : list

  const uniqueActions = [...new Set(list.map((l) => l.action).filter(Boolean))]

  const actionColors: Record<string, string> = {
    create: 'bg-emerald-900/50 text-emerald-400',
    edit: 'bg-blue-900/50 text-blue-400',
    delete: 'bg-red-900/50 text-red-400',
    sold: 'bg-amber-900/50 text-amber-400',
    unsold: 'bg-zinc-700 text-zinc-300',
    login: 'bg-purple-900/50 text-purple-400',
    attended: 'bg-teal-900/50 text-teal-400',
    unattended: 'bg-zinc-700 text-zinc-300',
    hide: 'bg-zinc-700 text-zinc-300',
    show: 'bg-emerald-900/50 text-emerald-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Historial</h1>
          <p className="text-zinc-400 text-sm">{filtered.length} registros</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/admin/logs"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              !action
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Todos
          </a>
          {uniqueActions.map((a) => (
            <a
              key={a}
              href={`/admin/logs?action=${a}`}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                action === a
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {a}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Acción</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Entidad</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Detalle</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-600">
                  No hay registros
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        actionColors[log.action] ?? 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {log.entity ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs max-w-xs truncate">
                    {log.details ?? log.entityId ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {log.userName ?? log.userEmail ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {new Date(log.createdAt).toLocaleString('es-AR')}
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