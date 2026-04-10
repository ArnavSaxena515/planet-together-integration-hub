import { redis } from './redis'
import type { PlantWarehouse } from './types/plant-warehouse'

const KEY = 'plant-warehouses'

function pwKey(pw: PlantWarehouse) { return `${pw.WarehouseExternalId}::${pw.PlantExternalId}` }

export async function upsertPlantWarehouse(pw: PlantWarehouse): Promise<void> {
  const existing: PlantWarehouse[] = await redis.get(KEY) ?? []
  const idx = existing.findIndex(e => pwKey(e) === pwKey(pw))
  if (idx >= 0) existing[idx] = pw; else existing.push(pw)
  await redis.set(KEY, existing)
}

export async function getPlantWarehouses(): Promise<PlantWarehouse[]> {
  return await redis.get(KEY) ?? []
}

export async function getPlantWarehouseCount(): Promise<number> {
  const pws: PlantWarehouse[] = await redis.get(KEY) ?? []
  return pws.length
}
