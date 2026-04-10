import { redis } from './redis'
import type { SalesOrder } from './types/sales-order'

const KEY = 'sales-orders'

export async function upsertSalesOrders(incoming: SalesOrder[]): Promise<number> {
  if (incoming.length === 0) return 0
  const entries: Record<string, SalesOrder> = {}
  for (const order of incoming) {
    entries[order.ExternalId] = order
  }
  await redis.hset(KEY, entries)
  return incoming.length
}

export async function getSalesOrders(): Promise<SalesOrder[]> {
  const hash: Record<string, SalesOrder> | null = await redis.hgetall(KEY)
  if (!hash) return []
  return Object.values(hash)
}

export async function getSalesOrderByExternalId(externalId: string): Promise<SalesOrder | null> {
  const raw: SalesOrder | null = await redis.hget(KEY, externalId)
  return raw ?? null
}

export async function patchSalesOrder(externalId: string, patch: Partial<SalesOrder>): Promise<SalesOrder | null> {
  const existing = await getSalesOrderByExternalId(externalId)
  if (!existing) return null
  const updated = { ...existing, ...patch }
  await redis.hset(KEY, { [externalId]: updated })
  return updated
}
