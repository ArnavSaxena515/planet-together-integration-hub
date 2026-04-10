import { prisma } from "@/lib/db/prisma";
import { KpiCard } from "@/components/shared/KpiCard";
import { formatCurrency } from "@/lib/utils/format";

export default async function DashboardPage() {
  const orderCount = await prisma.salesOrder.count();
  const orders = await prisma.salesOrder.findMany();
  const totalValue = orders.reduce((sum, o) => sum + o.totalNetAmount, 0);
  const syncCount = await prisma.syncLog.count();
  const errorCount = await prisma.syncLog.count({ where: { status: "Failed" } });

  return (
    <section className="p-8 space-y-8">
      <div>
        <h2 className="text-[1.375rem] font-semibold text-on-surface mb-1">Dashboard</h2>
        <p className="text-sm text-on-surface-variant">Overview of your SAP integration activity.</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <KpiCard label="Sales Orders" value={orderCount} subtext="Total in system" icon="receipt_long" accentColor="bg-blue-500" />
        <KpiCard label="Total Value" value={formatCurrency(totalValue, "GBP")} subtext="Across all orders" icon="payments" accentColor="bg-emerald-500" />
        <KpiCard label="Sync Events" value={syncCount} subtext="Total sync log entries" icon="sync_alt" accentColor="bg-purple-500" />
        <KpiCard label="Errors" value={errorCount} subtext="Failed syncs" icon="error" accentColor="bg-red-500" borderLeft="border-red-400" />
      </div>
    </section>
  );
}
