
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = new pg.Client(process.env.DATABASE_URL_OLD)

async function test() {
    try {
        await client.connect()
        console.log('✅ Conexión exitosa a Hostinger')

        const result = await client.query('SELECT COUNT(*) FROM autos')
        console.log(`✅ Registros en autos: ${result.rows[0].count}`)

        await client.end()
    } catch (err) {
        console.error('❌ Error de conexión:', err)
    }
}

test()