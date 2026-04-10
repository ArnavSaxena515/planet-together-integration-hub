"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/" },
  { label: "Sales Orders", icon: "receipt_long", href: "/sales-orders" },
  { label: "Items", icon: "category", href: "/items" },
  { label: "Inventory", icon: "inventory_2", href: "/inventory" },
  { label: "Sync Log", icon: "sync_alt", href: "/sync-log" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-[#1B2A47] flex flex-col py-6 antialiased tracking-tight z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
            <MaterialIcon icon="hub" className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Integration Hub</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Active Session</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/15 text-white border-r-2 border-blue-500 opacity-100"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MaterialIcon icon={item.icon} />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="py-3 mb-6 px-3 bg-white/5 rounded-lg">
          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Connection Status: Stable
          </span>
        </div>
        <div className="space-y-1">
          <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors" href="#">
            <MaterialIcon icon="help" className="text-sm" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Support</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors" href="#">
            <MaterialIcon icon="logout" className="text-sm" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Log Out</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
