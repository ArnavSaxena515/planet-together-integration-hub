import { getPlantWarehouses } from '@/lib/plant-warehouses'
import { PlantDataTable } from '@/components/plant-data/PlantDataTable'
import { KpiCard } from '@/components/shared/KpiCard'

export const dynamic = 'force-dynamic'

export default async function PlantDataPage() {
  const plantWarehouses = await getPlantWarehouses()

  const uniquePlants = new Set(plantWarehouses.map(pw => pw.PlantExternalId)).size
  const uniqueWarehouses = new Set(plantWarehouses.map(pw => pw.WarehouseExternalId)).size

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          label="Plant-Warehouse Links"
          value={plantWarehouses.length}
          subtext="Synced from SAP"
          icon="account_tree"
          accentColor="bg-blue-500"
        />
        <KpiCard
          label="Unique Plants"
          value={uniquePlants}
          subtext="Linked to warehouses"
          icon="factory"
          accentColor="bg-emerald-500"
        />
        <KpiCard
          label="Unique Warehouses"
          value={uniqueWarehouses}
          subtext="Linked to plants"
          icon="warehouse"
          accentColor="bg-amber-500"
        />
      </div>
      <PlantDataTable plantWarehouses={plantWarehouses} />
    </section>
  )
}
