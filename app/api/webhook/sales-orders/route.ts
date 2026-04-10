import { upsertSalesOrders } from '@/lib/sales-orders'
import { writeSyncLog } from '@/lib/sync-log'
import { cleanSAPRecord } from '@/lib/utils/sap-string'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const records = [
      ...(body.bulk_sales_orders ?? []),
      ...(body.single_sales_order && Object.keys(body.single_sales_order).length
        ? [body.single_sales_order]
        : [])
    ].map(r => cleanSAPRecord(r))
    const upserted = await upsertSalesOrders(records)
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Sales Orders',
      recordCount: upserted,
      status: 'Success',
    })
    return Response.json({ success: true, upserted })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Inbound',
      objectType: 'Sales Orders',
      recordCount: 0,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
