'use server'

import { db } from '@/db'
import { leads } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { writeLog } from '@/lib/admin-log'
import { revalidatePath } from 'next/cache'

export async function toggleAttended(id: string, current: boolean) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  await db
    .update(leads)
    .set({ isAttended: !current })
    .where(eq(leads.id, id))

  await writeLog({
    userId: session.user.id!,
    action: current ? 'unattended' : 'attended',
    entity: 'lead',
    entityId: id,
  })

  revalidatePath('/admin/leads')
}

export async function deleteLead(id: string) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  await db.delete(leads).where(eq(leads.id, id))

  await writeLog({
    userId: session.user.id!,
    action: 'delete',
    entity: 'lead',
    entityId: id,
  })

  revalidatePath('/admin/leads')
}