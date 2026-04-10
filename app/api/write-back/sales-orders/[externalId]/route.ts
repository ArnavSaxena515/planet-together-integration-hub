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
    const patch: Record<string, string> = {}
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
    if (!existing)
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })

    const start = patch.ScheduledStartDate ?? existing.ScheduledStartDate
    const end = patch.ScheduledEndDate ?? existing.ScheduledEndDate
    if (start && end && !String(start).startsWith(SAP_NULL_DATE) && !String(end).startsWith(SAP_NULL_DATE)) {
      if (new Date(end) < new Date(start)) {
        return Response.json({ success: false, error: 'Scheduled End Date must be after Start Date' }, { status: 400 })
      }
    }

    // Patch Redis
    const updated = await patchSalesOrder(params.externalId, patch)

    // Normalize values for the workflow
    const normalizedPatch: Record<string, string> = {}
    for (const [key, value] of Object.entries(patch)) {
      if (key === 'RequestedQty') {
        normalizedPatch[key] = String(parseFloat(value))
      } else {
        // Format as "YYYY-MM-DD 00:00:00" for MySQL/SAP
        const d = new Date(value)
        const yyyy = d.getUTCFullYear()
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(d.getUTCDate()).padStart(2, '0')
        normalizedPatch[key] = `${yyyy}-${mm}-${dd} 00:00:00`
      }
    }

    // Build workflow payload
    const workflowPayload = {
      orders: [
        {
          ExternalId: existing.ExternalId,
          SalesOrderNumber: existing.SalesOrderNumber,
          SalesOrderItem: existing.SalesOrderItem && existing.SalesOrderItem !== "0" && existing.SalesOrderItem !== "" ? existing.SalesOrderItem : "10",
          changes: normalizedPatch,
        },
      ],
    }

    // Call Cobalt workflow
    const apiKey = process.env.COBALT_API_KEY
    if (!apiKey) {
      throw new Error('COBALT_API_KEY not configured')
    }

    const workflowRes = await fetch(
      'https://sapis.gocobalt.io/api/v1/workflow/69d8ed8c9802ffb2864b85e1/execute',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'linked_account_id': 'cobalt_test_user',
          'slug': 'Refo-695',
          'sync_execution': 'false',
        },
        body: JSON.stringify(workflowPayload),
      }
    )

    if (!workflowRes.ok) {
      const errText = await workflowRes.text()
      console.error('[write-back] Workflow failed:', workflowRes.status, errText)
      throw new Error(`Workflow call failed: ${workflowRes.status}`)
    }

    console.log('[write-back] Workflow triggered for:', params.externalId, normalizedPatch)

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
