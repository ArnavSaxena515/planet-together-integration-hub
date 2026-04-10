import { redis } from './redis'
import type { SalesOrder } from './types/sales-order'

const KEY = 'sales-orders'

export async function upsertSalesOrders(incoming: SalesOrder[]): Promise<number> {
  if (incoming.length === 0) return 0
  const entries: Record<string, string> = {}
  for (const order of incoming) {
    entries[order.ExternalId] = JSON.stringify(order)
  }
  await redis.hset(KEY, entries)
  return incoming.length
}

export async function getSalesOrders(): Promise<SalesOrder[]> {
  const hash = await redis.hgetall(KEY)
  if (!hash) return []
  return Object.values(hash).map(v => JSON.parse(v as string) as SalesOrder)
}

export async function getSalesOrderByExternalId(externalId: string): Promise<SalesOrder | null> {
  const raw = await redis.hget(KEY, externalId)
  if (!raw) return null
  return JSON.parse(raw as string) as SalesOrder
}

export async function patchSalesOrder(externalId: string, patch: Partial<SalesOrder>): Promise<SalesOrder | null> {
  const existing = await getSalesOrderByExternalId(externalId)
  if (!existing) return null
  const updated = { ...existing, ...patch }
  await redis.hset(KEY, { [externalId]: JSON.stringify(updated) })
  return updated
}
