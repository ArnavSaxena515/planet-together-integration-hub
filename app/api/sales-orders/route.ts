import { getSalesOrders } from '@/lib/sales-orders'

export async function GET() {
  const orders = await getSalesOrders()
  return Response.json({ orders })
}
