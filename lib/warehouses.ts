import { redis } from './redis'
import type { Warehouse } from './types/warehouse'

const KEY = 'warehouses'

export async function upsertWarehouse(wh: Warehouse): Promise<void> {
  await redis.hset(KEY, { [wh.ExternalId]: JSON.stringify(wh) })
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const hash = await redis.hgetall(KEY)
  if (!hash) return []
  return Object.values(hash).map(v => JSON.parse(v as string) as Warehouse)
}

export async function getWarehouseCount(): Promise<number> {
  return await redis.hlen(KEY)
}
