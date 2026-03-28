'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, ne, and, count } from 'drizzle-orm'
import { auth } from '@/auth'
import { writeLog } from '@/lib/admin-log'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function createUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  const password = formData.get('password') as string
  const hashed = await bcrypt.hash(password, 12)

  const [user] = await db.insert(users).values({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: hashed,
    role: formData.get('role') as string,
  }).returning()

  await writeLog({
    userId: session.user.id!,
    action: 'create',
    entity: 'user',
    entityId: user.id,
    details: user.email,
  })

  revalidatePath('/admin/users')
}

export async function toggleUserActive(id: string, currentRole: string) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  // No desactivar el último admin
  if (currentRole === 'admin') {
    const [{ count: adminCount }] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'admin'))

    if (adminCount <= 1) {
      throw new Error('Debe haber al menos un admin activo')
    }
  }

  const newRole = currentRole === 'desactivado' ? 'vendedor' : 'desactivado'

  await db.update(users).set({ role: newRole }).where(eq(users.id, id))

  await writeLog({
    userId: session.user.id!,
    action: newRole === 'desactivado' ? 'deactivate' : 'activate',
    entity: 'user',
    entityId: id,
  })

  revalidatePath('/admin/users')
}

export async function changeUserRole(id: string, newRole: string) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  // No degradar el último admin
  if (newRole !== 'admin') {
    const [{ count: adminCount }] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'admin'))

    if (adminCount <= 1) {
      throw new Error('Debe haber al menos un admin activo')
    }
  }

  await db.update(users).set({ role: newRole }).where(eq(users.id, id))

  await writeLog({
    userId: session.user.id!,
    action: 'role_change',
    entity: 'user',
    entityId: id,
    details: newRole,
  })

  revalidatePath('/admin/users')
}