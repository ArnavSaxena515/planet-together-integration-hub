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

  const handleTriggerSync = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      const res = await fetch("/api/trigger-sync", { method: "POST" });
      if (!res.ok) throw new Error("Trigger failed");
      setSyncStatus("synced");
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch {
      setSyncStatus("idle");
    }
  }, [setSyncStatus, setLastSyncTime]);

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
        </div>
        <button
          onClick={handleTriggerSync}
          disabled={syncStatus === "syncing"}
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
