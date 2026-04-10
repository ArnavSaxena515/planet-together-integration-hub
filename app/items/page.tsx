import { getItems } from '@/lib/items'
import { ItemsTable } from '@/components/items/ItemsTable'
import { KpiCard } from '@/components/shared/KpiCard'

export const dynamic = 'force-dynamic'

export default async function ItemsPage() {
  const items = await getItems()

  const manufactured = items.filter(i => i.Source === 'Manufactured').length
  const purchased = items.filter(i => i.Source === 'Purchased').length
  const productTypes = new Set(items.map(i => i.SAPProductType)).size

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          label="Total Items"
          value={items.length}
          subtext="Synced from SAP"
          icon="category"
          accentColor="bg-blue-500"
        />
        <KpiCard
          label="Manufactured"
          value={manufactured}
          subtext={items.length ? `${Math.round((manufactured / items.length) * 100)}% of total` : 'No data'}
          icon="precision_manufacturing"
          accentColor="bg-emerald-500"
        />
        <KpiCard
          label="Purchased"
          value={purchased}
          subtext={items.length ? `${Math.round((purchased / items.length) * 100)}% of total` : 'No data'}
          icon="shopping_cart"
          accentColor="bg-amber-500"
        />
        <KpiCard
          label="Product Types"
          value={productTypes}
          subtext="Unique SAP types"
          icon="label"
          accentColor="bg-purple-500"
        />
      </div>
      <ItemsTable items={items} />
    </section>
  )
}
