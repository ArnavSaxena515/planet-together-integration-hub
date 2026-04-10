import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/inventory'

export const dynamic = 'force-dynamic'

export async function GET() {
  const inventory = await getInventory()
  return NextResponse.json(inventory)
}
