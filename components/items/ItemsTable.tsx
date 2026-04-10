"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/DataTable"
import { TableToolbar } from "@/components/tables/TableToolbar"
import { Pagination } from "@/components/tables/Pagination"
import type { Item } from "@/lib/types/item"

const columns: ColumnDef<Item, unknown>[] = [
  {
    accessorKey: "ExternalId",
    header: "External ID",
    cell: ({ getValue }) => <span className="text-xs font-bold text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ getValue }) => <span className="text-xs text-on-surface font-medium">{getValue() as string}</span>,
  },
  {
    accessorKey: "Source",
    header: "Source",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "SAPProductType",
    header: "Product Type",
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "SAPProductGroup",
    header: "Product Group",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "BaseUnit",
    header: "Base Unit",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "LotUsability",
    header: "Lot Usability",
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

interface ItemsTableProps {
  items: Item[]
}

export function ItemsTable({ items }: ItemsTableProps) {
  const [search, setSearch] = useState("")

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <TableToolbar
        title="Items"
        recordCount={items.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search items..."
      />
      <DataTable
        data={items}
        columns={columns}
        searchValue={search}
        getRowId={(row) => row.ExternalId}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        totalRecords={items.length}
        pageSize={items.length}
        onPageChange={() => {}}
      />
    </div>
  )
}
