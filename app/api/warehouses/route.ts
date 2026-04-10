import { NextResponse } from 'next/server'
import { getWarehouses } from '@/lib/warehouses'

export const dynamic = 'force-dynamic'

export async function GET() {
  const warehouses = await getWarehouses()
  return NextResponse.json(warehouses)
}
