import { redis } from './redis'
import type { Inventory } from './types/inventory'

const KEY = 'inventory'

function inventoryKey(i: Inventory) { return `${i.ItemExternalId}::${i.WarehouseExternalId}` }

export async function upsertInventory(inv: Inventory): Promise<void> {
  await redis.hset(KEY, { [inventoryKey(inv)]: inv })
}

export async function getInventory(): Promise<Inventory[]> {
  try {
    const hash: Record<string, Inventory> | null = await redis.hgetall(KEY)
    if (!hash) return []
    return Object.values(hash)
  } catch {
    await redis.del(KEY)
    return []
  }
}

export async function getInventoryCount(): Promise<number> {
  return await redis.hlen(KEY)
}
