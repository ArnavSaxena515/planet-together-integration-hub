import { redis } from './redis'
import type { Inventory } from './types/inventory'

const KEY = 'inventory'

function inventoryKey(i: Inventory) { return `${i.ItemExternalId}::${i.WarehouseExternalId}` }

export async function upsertInventory(inv: Inventory): Promise<void> {
  const existing: Inventory[] = await redis.get(KEY) ?? []
  const idx = existing.findIndex(e => inventoryKey(e) === inventoryKey(inv))
  if (idx >= 0) existing[idx] = inv; else existing.push(inv)
  await redis.set(KEY, existing)
}

export async function getInventory(): Promise<Inventory[]> {
  return await redis.get(KEY) ?? []
}

export async function getInventoryCount(): Promise<number> {
  const inv: Inventory[] = await redis.get(KEY) ?? []
  return inv.length
}
