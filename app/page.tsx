import { getSalesOrders } from '@/lib/sales-orders'
import { getSyncLog } from '@/lib/sync-log'
import { KpiCard } from '@/components/shared/KpiCard'
import { formatAmount } from '@/lib/utils/format'
import { getItemCount } from '@/lib/items'
import { getInventoryCount } from '@/lib/inventory'
import { getWarehouseCount } from '@/lib/warehouses'
import { getPlantWarehouseCount } from '@/lib/plant-warehouses'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [orders, logs, items, inventory, warehouses, plantWarehouses] = await Promise.all([
    getSalesOrders(),
    getSyncLog(50),
    getItemCount(),
    getInventoryCount(),
    getWarehouseCount(),
    getPlantWarehouseCount(),
  ])

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
        <KpiCard label="Items" value={items} subtext="Synced from SAP" icon="category" accentColor="bg-indigo-500" />
        <KpiCard label="Inventory Records" value={inventory} subtext="Across all locations" icon="inventory_2" accentColor="bg-teal-500" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        <KpiCard label="Warehouses" value={warehouses} subtext="Synced from SAP" icon="warehouse" accentColor="bg-amber-500" />
        <KpiCard label="Plant Data" value={plantWarehouses} subtext="Plant-warehouse links" icon="account_tree" accentColor="bg-orange-500" />
        <KpiCard label="Sync Events" value={logs.length} subtext="Total sync log entries" icon="sync_alt" accentColor="bg-purple-500" />
        <KpiCard label="Errors" value={errorCount} subtext="Failed syncs" icon="error" accentColor="bg-red-500" borderLeft="border-red-400" />
      </div>
    </section>
  )
}
