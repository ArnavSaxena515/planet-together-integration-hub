import { redis } from './redis'
import type { SalesOrder } from './types/sales-order'

const KEY = 'sales-orders'

export async function upsertSalesOrders(incoming: SalesOrder[]): Promise<number> {
  const existing: SalesOrder[] = await redis.get(KEY) ?? []
  const map = new Map(existing.map(o => [o.ExternalId, o]))
  for (const order of incoming) map.set(order.ExternalId, order)
  const merged = Array.from(map.values())
  await redis.set(KEY, merged)
  return incoming.length
}

export async function getSalesOrders(): Promise<SalesOrder[]> {
  return await redis.get(KEY) ?? []
}

export async function getSalesOrderByExternalId(externalId: string): Promise<SalesOrder | null> {
  const orders = await getSalesOrders()
  return orders.find(o => o.ExternalId === externalId) ?? null
}

export async function patchSalesOrder(externalId: string, patch: Partial<SalesOrder>): Promise<SalesOrder | null> {
  const orders = await getSalesOrders()
  const idx = orders.findIndex(o => o.ExternalId === externalId)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], ...patch }
  await redis.set(KEY, orders)
  return orders[idx]
}
