import { db } from '@/db'
import { siteConfig } from '@/db/schema'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ConfigForm } from './config-form'

export default async function ConfigPage() {
  const session = await auth()
  if (session?.user?.role !== 'admin') redirect('/admin')

  const configList = await db.select().from(siteConfig)

  const config: Record<string, string> = {}
  for (const item of configList) {
    config[item.key] = item.value
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Configuración</h1>
        <p className="text-zinc-400 text-sm">Datos de contacto y redes sociales</p>
      </div>
      <ConfigForm config={config} />
    </div>
  )
}