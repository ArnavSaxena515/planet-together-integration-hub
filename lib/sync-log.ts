import { redis } from './redis'

export type { SyncLogEntry } from './types/sync-log'
import type { SyncLogEntry } from './types/sync-log'

const KEY = 'sync-log'

export async function writeSyncLog(entry: Omit<SyncLogEntry, 'id' | 'timestamp'>) {
  const full: SyncLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
  await redis.lpush(KEY, JSON.parse(JSON.stringify(full)))
  await redis.ltrim(KEY, 0, 499)
}

export async function getSyncLog(limit = 50): Promise<SyncLogEntry[]> {
  return await redis.lrange(KEY, 0, limit - 1)
}
