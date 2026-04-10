import { prisma } from "@/lib/db/prisma";
import { SalesOrdersTable } from "@/components/sales-orders/SalesOrdersTable";
import { SalesOrderSlideOver } from "@/components/sales-orders/SalesOrderSlideOver";
import { KpiCard } from "@/components/shared/KpiCard";
import { formatCurrency } from "@/lib/utils/format";

export default async function SalesOrdersPage() {
  const orders = await prisma.salesOrder.findMany({ orderBy: { id: "asc" } });
  const serialized = orders.map((o) => ({
    ...o,
    requestedDeliveryDate: o.requestedDeliveryDate.toISOString(),
    salesOrderDate: o.salesOrderDate.toISOString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  const totalValue = orders.reduce((sum, o) => sum + o.totalNetAmount, 0);
  const complete = orders.filter((o) => o.sapProcessStatus === "C").length;
  const pending = orders.filter((o) => o.sapProcessStatus === "A" || o.sapProcessStatus === "B").length;

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard
          label="Total Open Orders"
          value={orders.length}
          subtext="Current active window"
          icon="order_approve"
          accentColor="bg-blue-500"
        />
        <KpiCard
          label="Total Value"
          value={formatCurrency(totalValue, "GBP")}
          subtext="+12% from last period"
          icon="payments"
          accentColor="bg-emerald-500"
        />
        <KpiCard
          label="Fully Processed"
          value={complete}
          subtext={`${Math.round((complete / orders.length) * 100)}% completion rate`}
          icon="task_alt"
          accentColor="bg-slate-300"
        />
        <KpiCard
          label="Pending Action"
          value={pending}
          subtext="Action required"
          icon="pending_actions"
          accentColor="bg-amber-500"
          borderLeft="border-amber-400"
        />
      </div>
      <SalesOrdersTable orders={serialized} />
      <SalesOrderSlideOver orders={serialized} />
    </section>
  );
}
