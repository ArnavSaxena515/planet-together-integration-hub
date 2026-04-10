import { redis } from './redis'
import type { Warehouse } from './types/warehouse'

const KEY = 'warehouses'

export async function upsertWarehouse(wh: Warehouse): Promise<void> {
  const existing: Warehouse[] = await redis.get(KEY) ?? []
  const idx = existing.findIndex(w => w.ExternalId === wh.ExternalId)
  if (idx >= 0) existing[idx] = wh; else existing.push(wh)
  await redis.set(KEY, existing)
}

export async function getWarehouses(): Promise<Warehouse[]> {
  return await redis.get(KEY) ?? []
}

export async function getWarehouseCount(): Promise<number> {
  const whs: Warehouse[] = await redis.get(KEY) ?? []
  return whs.length
}
