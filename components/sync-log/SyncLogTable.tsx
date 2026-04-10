"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/DataTable"
import { DirectionBadge } from "@/components/shared/DirectionBadge"
import { MaterialIcon } from "@/components/shared/MaterialIcon"
import type { SyncLogEntry } from "@/lib/types/sync-log"

function formatLogDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const columns: ColumnDef<SyncLogEntry, unknown>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ getValue }) => (
      <span className="text-[13px] text-on-surface-variant font-medium">
        {formatLogDate(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ getValue }) => <DirectionBadge direction={getValue() as "Inbound" | "Outbound"} />,
  },
  {
    accessorKey: "objectType",
    header: "Object Type",
    cell: ({ getValue }) => (
      <span className="text-[13px] font-medium text-on-surface">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "recordCount",
    header: "Records",
    cell: ({ getValue }) => (
      <span className="text-[13px] text-on-surface-variant">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string
      return (
        <span
          className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
            status === "Success"
              ? "text-[#1E7E3B] bg-[#D4EDDA]"
              : "text-error bg-error-container"
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    id: "preview",
    header: () => <span className="text-right w-full block">Preview</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <button className="text-slate-400 hover:text-primary transition-colors">
          <MaterialIcon icon={row.original.status === "Failed" ? "error_outline" : "visibility"} />
        </button>
      </div>
    ),
    enableSorting: false,
  },
]

interface SyncLogTableProps {
  logs: SyncLogEntry[]
}

export function SyncLogTable({ logs }: SyncLogTableProps) {
  const [search, setSearch] = useState("")

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(27,42,71,0.08)] overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between bg-surface-container-lowest">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-on-surface">Sync Log</h3>
          <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">
            {logs.length} RECORDS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-surface-container-low border-none rounded-lg focus:ring-1 focus:ring-primary w-64 transition-all"
              placeholder="Search logs..."
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <MaterialIcon icon="filter_list" />
            Filter
          </button>
        </div>
      </div>
      <DataTable data={logs} columns={columns} searchValue={search} getRowId={(row) => row.id} />
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
        <div>Showing 1 to {logs.length} of {logs.length} entries</div>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 bg-primary text-white flex items-center justify-center rounded text-xs">1</button>
        </div>
      </div>
    </section>
  )
}
