import { NextResponse } from 'next/server'
import { getPlantWarehouses } from '@/lib/plant-warehouses'

export const dynamic = 'force-dynamic'

export async function GET() {
  const plantWarehouses = await getPlantWarehouses()
  return NextResponse.json(plantWarehouses)
}
