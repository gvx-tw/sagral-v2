import { db } from '@/db'
import { users } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { UserActions } from './user-actions'
import { NewUserForm } from './new-user-form'

export default async function UsersPage() {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/admin')

  const list = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-900/50 text-purple-400',
    vendedor: 'bg-blue-900/50 text-blue-400',
    desactivado: 'bg-zinc-700 text-zinc-500',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Usuarios</h1>
        <p className="text-zinc-400 text-sm">{list.length} usuarios registrados</p>
      </div>

      <NewUserForm />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Rol</th>
              <th className="text-left px-4 py-3 text-zinc-500 font-medium">Creado</th>
              <th className="text-right px-4 py-3 text-zinc-500 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr
                key={user.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-zinc-100 font-medium">{user.name ?? '—'}</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      roleColors[user.role] ?? 'bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('es-AR')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <UserActions
                    id={user.id}
                    role={user.role}
                    currentUserId={session.user.id!}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}