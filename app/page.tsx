import { getSalesOrders } from '@/lib/sales-orders'
import { getSyncLog } from '@/lib/sync-log'
import { KpiCard } from '@/components/shared/KpiCard'
import { formatAmount } from '@/lib/utils/format'

export default async function DashboardPage() {
  const orders = await getSalesOrders()
  const logs = await getSyncLog(50)

  const totalValue = orders
    .filter(o => o.TransactionCurrency === 'GBP')
    .reduce((sum, o) => sum + parseFloat(o.TotalNetAmount || '0'), 0)
  const errorCount = logs.filter(l => l.status === 'Failed').length

  return (
    <section className="p-8 space-y-8">
      <div>
        <h2 className="text-[1.375rem] font-semibold text-on-surface mb-1">Dashboard</h2>
        <p className="text-sm text-on-surface-variant">Overview of your SAP integration activity.</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <KpiCard label="Sales Orders" value={orders.length} subtext="Total in system" icon="receipt_long" accentColor="bg-blue-500" />
        <KpiCard label="Total Value (GBP)" value={formatAmount(String(totalValue), 'GBP')} subtext="Across all orders" icon="payments" accentColor="bg-emerald-500" />
        <KpiCard label="Sync Events" value={logs.length} subtext="Total sync log entries" icon="sync_alt" accentColor="bg-purple-500" />
        <KpiCard label="Errors" value={errorCount} subtext="Failed syncs" icon="error" accentColor="bg-red-500" borderLeft="border-red-400" />
      </div>
    </section>
  )
}
