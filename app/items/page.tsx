import { MaterialIcon } from "@/components/shared/MaterialIcon";

export default function ItemsPage() {
  return (
    <section className="p-8">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
        <MaterialIcon icon="category" className="text-6xl text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-on-surface mb-2">Items</h3>
        <p className="text-sm text-on-surface-variant">Item management coming soon. This page will mirror the Sales Orders pattern.</p>
      </div>
    </section>
  );
}
