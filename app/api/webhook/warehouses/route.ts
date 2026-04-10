import { upsertWarehouse } from '@/lib/warehouses'
import { writeSyncLog } from '@/lib/sync-log'
import { cleanSAPRecord } from '@/lib/utils/sap-string'
import type { Warehouse } from '@/lib/types/warehouse'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = body.single_warehouse
    if (!raw || !Object.keys(raw).length) {
      return Response.json({ success: true, message: 'No warehouse data' })
    }
    const wh = cleanSAPRecord(raw) as Warehouse
    await upsertWarehouse(wh)
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Warehouses',
      recordCount: 1,
      status: 'Success',
    })
    return Response.json({ success: true })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Warehouses',
      recordCount: 0,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
