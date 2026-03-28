'use server'

import { db } from '@/db'
import { siteConfig } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { writeLog } from '@/lib/admin-log'
import { revalidatePath } from 'next/cache'

export async function saveConfig(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  const entries = [
    'phone',
    'whatsapp',
    'email',
    'address',
    'hours',
    'instagram',
    'facebook',
  ]

  for (const key of entries) {
    const value = formData.get(key) as string
    if (value === null) continue

    const existing = await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.key, key))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(siteConfig)
        .set({ value })
        .where(eq(siteConfig.key, key))
    } else {
      await db.insert(siteConfig).values({ key, value })
    }
  }

  await writeLog({
    userId: session.user.id!,
    action: 'edit',
    entity: 'config',
    details: 'Configuración del sitio actualizada',
  })

  revalidatePath('/admin/config')
}