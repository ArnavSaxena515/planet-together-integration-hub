"use client";

import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { useAppStore } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const breadcrumbMap: Record<string, { category: string; label: string }> = {
  "/": { category: "Overview", label: "Dashboard" },
  "/sales-orders": { category: "SAP Objects", label: "Sales Orders" },
  "/items": { category: "SAP Objects", label: "Items" },
  "/inventory": { category: "SAP Objects", label: "Inventory" },
  "/warehouses": { category: "SAP Objects", label: "Warehouses" },
  "/plant-data": { category: "SAP Objects", label: "Plant Data" },
  "/sync-log": { category: "System", label: "Sync Log" },
  "/settings": { category: "System", label: "Settings" },
};

export function TopHeader() {
  const pathname = usePathname();
  const { syncStatus, setSyncStatus, lastSyncTime, setLastSyncTime } = useAppStore();
  const crumb = breadcrumbMap[pathname] || { category: "System", label: "Page" };
  const [lastSyncText, setLastSyncText] = useState("Never");

  useEffect(() => {
    if (!lastSyncTime) return;
    const update = () => setLastSyncText(timeAgo(lastSyncTime));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const [syncDetail, setSyncDetail] = useState("");

  const pollUntilStable = useCallback(async () => {
    const POLL_MS = 3000;
    const MIN_POLLS = Math.ceil(50000 / POLL_MS); // at least 50s of polling
    const MAX_POLLS = 60;
    const MAX_STABLE = 3;
    let prevTotal = -1;
    let stableCount = 0;

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      try {
        const res = await fetch("/api/sync-counts");
        const counts = await res.json();
        const total = counts.salesOrders + counts.items + counts.inventory + counts.warehouses + counts.plantWarehouses;
        setSyncDetail(`${counts.salesOrders} orders · ${counts.items} items · ${counts.inventory} inv · ${counts.warehouses} wh · ${counts.plantWarehouses} plant`);
        if (total === prevTotal) {
          stableCount++;
          // only stop early if we've polled for at least 50s
          if (stableCount >= MAX_STABLE && i >= MIN_POLLS) return;
        } else {
          stableCount = 0;
        }
        prevTotal = total;
      } catch {
        // ignore poll errors, keep trying
      }
    }
  }, []);

  const handleTriggerSync = useCallback(async () => {
    setSyncStatus("syncing");
    setSyncDetail("Triggering workflows...");
    try {
      const res = await fetch("/api/trigger-sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const body = await res.json();
      if (!res.ok) {
        console.error("Trigger sync failed:", body);
        alert(`Sync failed: ${JSON.stringify(body)}`);
        setSyncStatus("idle");
        setSyncDetail("");
        return;
      }
      setSyncDetail("Waiting for data...");
      await pollUntilStable();
      setSyncStatus("synced");
      setLastSyncTime(new Date());
      setSyncDetail("");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (err) {
      console.error("Trigger sync error:", err);
      alert(`Sync error: ${err}`);
      setSyncStatus("idle");
      setSyncDetail("");
    }
  }, [setSyncStatus, setLastSyncTime, pollUntilStable]);

  const [resetting, setResetting] = useState(false);

  const handleReset = useCallback(async () => {
    if (!confirm("This will clear all synced data (orders, items, inventory, warehouses, plant data). Continue?")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/reset-data", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        alert(`Reset failed: ${JSON.stringify(body)}`);
      } else {
        setSyncDetail("Data cleared — refreshing...");
        // Use router.refresh() would only work in app router client components
        // Force a full page reload so server components re-fetch from Redis
        window.location.reload();
        return;
      }
    } catch (err) {
      alert(`Reset error: ${err}`);
    } finally {
      setResetting(false);
    }
  }, []);

  return (
    <header className="h-14 w-full sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/20 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            <span>Integration Hub</span>
            <MaterialIcon icon="chevron_right" className="text-[10px]" />
            <span>{crumb.category}</span>
            <MaterialIcon icon="chevron_right" className="text-[10px]" />
            <span className="text-blue-600">{crumb.label}</span>
          </nav>
          <h2 className="text-[1.375rem] font-semibold text-on-surface leading-none">{crumb.label}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
            Last Sync: {lastSyncText}
          </p>
          {syncDetail && (
            <p className="text-[9px] text-blue-500 font-medium tracking-tight">{syncDetail}</p>
          )}
        </div>
        <button
          onClick={handleReset}
          disabled={resetting || syncStatus === "syncing"}
          className="text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-70"
        >
          {resetting ? "Resetting..." : "Reset Data"}
        </button>
        <button
          onClick={handleTriggerSync}
          disabled={syncStatus === "syncing" || resetting}
          className="bg-gradient-to-b from-primary-container to-primary text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-70"
        >
          {syncStatus === "syncing" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Syncing...
            </span>
          ) : syncStatus === "synced" ? (
            "Synced ✓"
          ) : (
            "Trigger Sync"
          )}
        </button>
        <div className="flex items-center gap-2 ml-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <MaterialIcon icon="notifications" />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <MaterialIcon icon="account_circle" />
          </button>
        </div>
      </div>
    </header>
  );
}
