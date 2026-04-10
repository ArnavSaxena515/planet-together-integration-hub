import { prisma } from "@/lib/db/prisma";
import { SyncLogTable } from "@/components/sync-log/SyncLogTable";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

export const dynamic = "force-dynamic";

export default async function SyncLogPage() {
  const logs = await prisma.syncLog.findMany({ orderBy: { timestamp: "desc" } });
  const serialized = logs.map((l) => ({ ...l, timestamp: l.timestamp.toISOString() }));

  const totalSyncs = logs.length;
  const successCount = logs.filter((l) => l.status === "Success").length;
  const errorCount = logs.filter((l) => l.status === "Failed").length;
  const successRate = totalSyncs > 0 ? ((successCount / totalSyncs) * 100).toFixed(1) : "0";

  return (
    <div className="p-8 space-y-6">
      {/* Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">Total Syncs (24h)</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-on-surface">{totalSyncs}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">Sync Success Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-on-surface">{successRate}%</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.04)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1">Errors Reported</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-error">{errorCount}</span>
          </div>
        </div>
      </div>

      <SyncLogTable logs={serialized as any} />

      {/* Action Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.04)] flex items-center gap-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <MaterialIcon icon="history" className="!text-[24px]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-on-surface mb-1">Clear Audit Logs</h4>
            <p className="text-xs text-slate-500">Automatically clear sync logs older than 90 days to maintain hub performance.</p>
          </div>
          <button className="text-blue-600 text-xs font-semibold hover:underline">Configure</button>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.04)] flex items-center gap-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <MaterialIcon icon="warning" className="!text-[24px]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-on-surface mb-1">Alerting Policy</h4>
            <p className="text-xs text-slate-500">{errorCount} endpoint(s) failed to respond. Immediate attention may be required.</p>
          </div>
          <button className="text-blue-600 text-xs font-semibold hover:underline">View Alert</button>
        </div>
      </div>
    </div>
  );
}
