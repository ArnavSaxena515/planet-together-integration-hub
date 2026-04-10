import { SalesOrdersTable } from "@/components/sales-orders/SalesOrdersTable";
import { SalesOrderSlideOver } from "@/components/sales-orders/SalesOrderSlideOver";
import { KpiCard } from "@/components/shared/KpiCard";

// TODO: Replace with real data source (Upstash Redis, etc.)
const orders: any[] = [];

export default function SalesOrdersPage() {
  const totalValue = orders.reduce((sum: number, o: any) => sum + o.totalNetAmount, 0);
  const complete = orders.filter((o: any) => o.sapProcessStatus === "C").length;
  const pending = orders.filter((o: any) => o.sapProcessStatus === "A" || o.sapProcessStatus === "B").length;

  return (
    <section className="p-8 space-y-8 flex-1">
      <div className="grid grid-cols-4 gap-6">
        <KpiCard label="Total Open Orders" value={orders.length} subtext="Current active window" icon="order_approve" accentColor="bg-blue-500" />
        <KpiCard label="Total Value" value={`£${totalValue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`} subtext="+12% from last period" icon="payments" accentColor="bg-emerald-500" />
        <KpiCard label="Fully Processed" value={complete} subtext={orders.length ? `${Math.round((complete / orders.length) * 100)}% completion rate` : "No data"} icon="task_alt" accentColor="bg-slate-300" />
        <KpiCard label="Pending Action" value={pending} subtext="Action required" icon="pending_actions" accentColor="bg-amber-500" borderLeft="border-amber-400" />
      </div>
      <SalesOrdersTable orders={orders} />
      <SalesOrderSlideOver orders={orders} />
    </section>
  );
}
