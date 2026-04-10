import { upsertItem } from '@/lib/items'
import { writeSyncLog } from '@/lib/sync-log'
import { cleanSAPRecord } from '@/lib/utils/sap-string'
import type { Item } from '@/lib/types/item'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const raw = body.single_item
    if (!raw || !Object.keys(raw).length) {
      return Response.json({ success: true, message: 'No item data' })
    }
    const item = cleanSAPRecord(raw) as Item
    await upsertItem(item)
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Items',
      recordCount: 1,
      status: 'Success',
    })
    return Response.json({ success: true })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Items',
      recordCount: 0,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
