import { redis } from './redis'
import type { Item } from './types/item'

const KEY = 'items'

export async function upsertItem(item: Item): Promise<void> {
  const existing: Item[] = await redis.get(KEY) ?? []
  const idx = existing.findIndex(i => i.ExternalId === item.ExternalId)
  if (idx >= 0) existing[idx] = item; else existing.push(item)
  await redis.set(KEY, existing)
}

export async function getItems(): Promise<Item[]> {
  return await redis.get(KEY) ?? []
}

export async function getItemCount(): Promise<number> {
  const items: Item[] = await redis.get(KEY) ?? []
  return items.length
}
