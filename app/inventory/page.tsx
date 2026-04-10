import { getInventory } from '@/lib/inventory'
import { InventoryTable } from '@/components/inventory/InventoryTable'
import { KpiCard } from '@/components/shared/KpiCard'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const inventory = await getInventory()

  const totalOnHand = inventory.reduce((sum, i) => sum + parseFloat(i.OnHandQty || '0'), 0)
  const uniqueWarehouses = new Set(inventory.map(i => i.WarehouseExternalId)).size
  const uniqueItems = new Set(inventory.map(i => i.ItemExternalId)).size

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          label="Inventory Records"
          value={inventory.length}
          subtext="Synced from SAP"
          icon="inventory_2"
          accentColor="bg-blue-500"
        />
        <KpiCard
          label="Total On Hand"
          value={totalOnHand.toLocaleString()}
          subtext="Across all locations"
          icon="package_2"
          accentColor="bg-emerald-500"
        />
        <KpiCard
          label="Warehouses"
          value={uniqueWarehouses}
          subtext="With inventory"
          icon="warehouse"
          accentColor="bg-amber-500"
        />
        <KpiCard
          label="Unique Items"
          value={uniqueItems}
          subtext="In inventory"
          icon="category"
          accentColor="bg-purple-500"
        />
      </div>
      <InventoryTable inventory={inventory} />
    </section>
  )
}
