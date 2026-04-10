import { upsertPlantWarehouse } from '@/lib/plant-warehouses'
import { writeSyncLog } from '@/lib/sync-log'
import { cleanSAPRecord } from '@/lib/utils/sap-string'
import type { PlantWarehouse } from '@/lib/types/plant-warehouse'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = body.single_plant_warehouse
    if (!raw || !Object.keys(raw).length) {
      return Response.json({ success: true, message: 'No plant warehouse data' })
    }
    const pw = cleanSAPRecord(raw) as PlantWarehouse
    await upsertPlantWarehouse(pw)
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Plant Data',
      recordCount: 1,
      status: 'Success',
    })
    return Response.json({ success: true })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Plant Data',
      recordCount: 0,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
