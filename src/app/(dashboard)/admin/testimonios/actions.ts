'use server'

import { db } from '@/db'
import { testimonials } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { writeLog } from '@/lib/admin-log'
import { revalidatePath } from 'next/cache'

export async function toggleVisible(id: string, current: boolean) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  await db
    .update(testimonials)
    .set({ isVisible: !current })
    .where(eq(testimonials.id, id))

  await writeLog({
    userId: session.user.id!,
    action: current ? 'hide' : 'show',
    entity: 'testimonial',
    entityId: id,
  })

  revalidatePath('/admin/testimonios')
}

export async function deleteTestimonial(id: string) {
  const session = await auth()
  if (!session) throw new Error('No autorizado')

  await db.delete(testimonials).where(eq(testimonials.id, id))

  await writeLog({
    userId: session.user.id!,
    action: 'delete',
    entity: 'testimonial',
    entityId: id,
  })

  revalidatePath('/admin/testimonios')
}