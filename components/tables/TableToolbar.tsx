"use client";

import { MaterialIcon } from "@/components/shared/MaterialIcon";

interface TableToolbarProps {
  title: string;
  recordCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function TableToolbar({
  title,
  recordCount,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
}: TableToolbarProps) {
  return (
    <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/50">
      <div className="flex items-center gap-4">
        <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">{title}</h4>
        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">
          {recordCount} RECORDS
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <MaterialIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-white border-none rounded-lg text-xs w-64 focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
            placeholder={searchPlaceholder}
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <MaterialIcon icon="filter_list" className="text-sm" />
          Status
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          Org
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <button className="p-1.5 text-slate-500 hover:text-primary transition-colors">
          <MaterialIcon icon="ios_share" />
        </button>
        <button className="p-1.5 text-slate-500 hover:text-primary transition-colors">
          <MaterialIcon icon="view_column" />
        </button>
      </div>
    </div>
  );
}
