import { redis } from './redis'
import type { Item } from './types/item'

const KEY = 'items'

export async function upsertItem(item: Item): Promise<void> {
  await redis.hset(KEY, { [item.ExternalId]: item })
}

export async function getItems(): Promise<Item[]> {
  const hash: Record<string, Item> | null = await redis.hgetall(KEY)
  if (!hash) return []
  return Object.values(hash)
}

export async function getItemCount(): Promise<number> {
  return await redis.hlen(KEY)
}
