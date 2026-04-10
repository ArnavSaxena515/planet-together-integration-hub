import { getWarehouses } from '@/lib/warehouses'
import { WarehousesTable } from '@/components/warehouses/WarehousesTable'
import { KpiCard } from '@/components/shared/KpiCard'

export const dynamic = 'force-dynamic'

export default async function WarehousesPage() {
  const warehouses = await getWarehouses()

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          label="Total Warehouses"
          value={warehouses.length}
          subtext="Synced from SAP"
          icon="warehouse"
          accentColor="bg-blue-500"
        />
      </div>
      <WarehousesTable warehouses={warehouses} />
    </section>
  )
}
