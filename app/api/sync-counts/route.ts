import { NextResponse } from 'next/server'
import { getSalesOrders } from '@/lib/sales-orders'
import { getItemCount } from '@/lib/items'
import { getInventoryCount } from '@/lib/inventory'
import { getWarehouseCount } from '@/lib/warehouses'
import { getPlantWarehouseCount } from '@/lib/plant-warehouses'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [salesOrders, items, inventory, warehouses, plantWarehouses] = await Promise.all([
    getSalesOrders().then(o => o.length),
    getItemCount(),
    getInventoryCount(),
    getWarehouseCount(),
    getPlantWarehouseCount(),
  ])
  return NextResponse.json({ salesOrders, items, inventory, warehouses, plantWarehouses })
}
