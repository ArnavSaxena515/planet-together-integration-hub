import { upsertInventory } from '@/lib/inventory'
import { writeSyncLog } from '@/lib/sync-log'
import { cleanSAPRecord } from '@/lib/utils/sap-string'
import type { Inventory } from '@/lib/types/inventory'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = body.single_inventory
    if (!raw || !Object.keys(raw).length) {
      return Response.json({ success: true, message: 'No inventory data' })
    }
    const inv = cleanSAPRecord(raw) as Inventory
    await upsertInventory(inv)
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Inventory',
      recordCount: 1,
      status: 'Success',
    })
    return Response.json({ success: true })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Inventory',
      recordCount: 0,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
