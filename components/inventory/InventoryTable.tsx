"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/DataTable"
import { TableToolbar } from "@/components/tables/TableToolbar"
import { Pagination } from "@/components/tables/Pagination"
import type { Inventory } from "@/lib/types/inventory"

const columns: ColumnDef<Inventory, unknown>[] = [
  {
    accessorKey: "ItemExternalId",
    header: "Item ID",
    cell: ({ getValue }) => <span className="text-xs font-bold text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: "WarehouseExternalId",
    header: "Warehouse ID",
    cell: ({ getValue }) => <span className="text-xs font-bold text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: "OnHandQty",
    header: () => <span className="text-right w-full block">On Hand Qty</span>,
    cell: ({ getValue }) => (
      <span className="text-xs font-semibold text-on-surface text-right block">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "LeadTimeDays",
    header: "Lead Time (Days)",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "MRPProcessing",
    header: "MRP Processing",
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "SAPStorageLocation",
    header: "Storage Location",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "SourceSystem",
    header: "Source System",
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{getValue() as string}</span>
    ),
  },
]

interface InventoryTableProps {
  inventory: Inventory[]
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const [search, setSearch] = useState("")

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <TableToolbar
        title="Inventory"
        recordCount={inventory.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search inventory..."
      />
      <DataTable
        data={inventory}
        columns={columns}
        searchValue={search}
        getRowId={(row) => `${row.ItemExternalId}::${row.WarehouseExternalId}`}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        totalRecords={inventory.length}
        pageSize={inventory.length}
        onPageChange={() => {}}
      />
    </div>
  )
}
