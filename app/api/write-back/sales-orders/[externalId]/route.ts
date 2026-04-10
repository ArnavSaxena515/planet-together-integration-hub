import { patchSalesOrder, getSalesOrderByExternalId } from '@/lib/sales-orders'
import { writeSyncLog } from '@/lib/sync-log'

const WRITABLE_FIELDS = [
  'RequestedQty',
  'RequestedDeliveryDate',
  'ScheduledStartDate',
  'ScheduledEndDate',
] as const

const SAP_NULL_DATE = '1899-11-30'

export async function POST(
  req: Request,
  { params }: { params: { externalId: string } }
) {
  try {
    const body = await req.json()
    const patch: Record<string, any> = {}
    for (const key of WRITABLE_FIELDS) {
      if (key in body) patch[key] = body[key]
    }
    if (Object.keys(patch).length === 0)
      return Response.json({ success: false, error: 'No writable fields provided' }, { status: 400 })

    // Reject SAP null sentinel dates as input
    for (const key of ['RequestedDeliveryDate', 'ScheduledStartDate', 'ScheduledEndDate'] as const) {
      if (patch[key] && String(patch[key]).startsWith(SAP_NULL_DATE)) {
        return Response.json({ success: false, error: `${key} cannot be the SAP null date (1899-11-30)` }, { status: 400 })
      }
    }

    // Date ordering validation
    const existing = await getSalesOrderByExternalId(params.externalId)
    const start = patch.ScheduledStartDate ?? existing?.ScheduledStartDate
    const end = patch.ScheduledEndDate ?? existing?.ScheduledEndDate
    if (start && end && !String(start).startsWith(SAP_NULL_DATE) && !String(end).startsWith(SAP_NULL_DATE)) {
      if (new Date(end) < new Date(start)) {
        return Response.json({ success: false, error: 'Scheduled End Date must be after Start Date' }, { status: 400 })
      }
    }

    const updated = await patchSalesOrder(params.externalId, patch)
    if (!updated)
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })

    // TODO: Forward to SAP S/4HANA
    // await sapClient.patch(`/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('${params.externalId}')`, patch)
    console.log('[write-back] SAP forward stub:', params.externalId, patch)

    await writeSyncLog({
      direction: 'Outbound',
      objectType: 'Sales Orders',
      recordCount: 1,
      status: 'Success',
    })
    return Response.json({
      success: true,
      externalId: params.externalId,
      updatedFields: Object.keys(patch),
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    await writeSyncLog({
      direction: 'Outbound',
      objectType: 'Sales Orders',
      recordCount: 1,
      status: 'Failed',
      errorMsg: err.message,
    })
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
