import { redis } from './redis'
import type { Inventory } from './types/inventory'

const KEY = 'inventory'

function inventoryKey(i: Inventory) { return `${i.ItemExternalId}::${i.WarehouseExternalId}` }

export async function upsertInventory(inv: Inventory): Promise<void> {
  await redis.hset(KEY, { [inventoryKey(inv)]: JSON.stringify(inv) })
}

export async function getInventory(): Promise<Inventory[]> {
  const hash = await redis.hgetall(KEY)
  if (!hash) return []
  return Object.values(hash).map(v => JSON.parse(v as string) as Inventory)
}

export async function getInventoryCount(): Promise<number> {
  return await redis.hlen(KEY)
}
