import { redis } from './redis'
import type { PlantWarehouse } from './types/plant-warehouse'

const KEY = 'plant-warehouses'

function pwKey(pw: PlantWarehouse) { return `${pw.WarehouseExternalId}::${pw.PlantExternalId}` }

export async function upsertPlantWarehouse(pw: PlantWarehouse): Promise<void> {
  await redis.hset(KEY, { [pwKey(pw)]: pw })
}

export async function getPlantWarehouses(): Promise<PlantWarehouse[]> {
  try {
    const hash: Record<string, PlantWarehouse> | null = await redis.hgetall(KEY)
    if (!hash) return []
    return Object.values(hash)
  } catch {
    await redis.del(KEY)
    return []
  }
}

export async function getPlantWarehouseCount(): Promise<number> {
  return await redis.hlen(KEY)
}
