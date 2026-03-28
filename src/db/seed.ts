import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { siteConfig, users } from './schema'
import bcrypt from 'bcryptjs'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function seed() {
    console.log('🌱 Iniciando seed...')

    // ── site_config ──────────────────────────────────────────────
    console.log('📋 Insertando site_config...')

    await db.insert(siteConfig).values([
        { key: 'phone', value: '+54 362 400-0000' },
        { key: 'whatsapp', value: '+54 362 400-0000' },
        { key: 'email', value: 'info@sagralautomotores.com' },
        { key: 'address', value: 'Av. Ejemplo 1234, Sáenz Peña, Chaco' },
        { key: 'hours_week', value: 'Lunes a Viernes 8:00 - 18:00' },
        { key: 'hours_sat', value: 'Sábados 8:00 - 13:00' },
        { key: 'instagram', value: 'https://instagram.com/sagralautomotores' },
        { key: 'facebook', value: 'https://facebook.com/sagralautomotores' },
    ]).onConflictDoNothing()

    // ── usuario admin ─────────────────────────────────────────────
    console.log('👤 Insertando usuario admin...')

    const passwordHash = await bcrypt.hash('admin1234', 10)

    await db.insert(users).values({
        name: 'Administrador',
        email: 'admin@sagralautomotores.com',
        password: passwordHash,
        role: 'admin',
    }).onConflictDoNothing()

    console.log('✅ Seed completo')
    process.exit(0)
}

seed().catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
})