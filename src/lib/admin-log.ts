import { db } from '@/db'
import { adminLogs } from '@/db/schema'

type LogParams = {
    userId: string
    action: string
    entity?: string
    entityId?: string
    details?: string
}

export async function writeLog(params: LogParams) {
    try {
        await db.insert(adminLogs).values({
            userId: params.userId,
            action: params.action,
            entity: params.entity ?? null,
            entityId: params.entityId ?? null,
            details: params.details ?? null,
        })
    } catch (err) {
        console.error('[admin-log]', err)
    }
}