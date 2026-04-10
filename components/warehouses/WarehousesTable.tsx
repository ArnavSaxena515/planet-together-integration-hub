"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/DataTable"
import { TableToolbar } from "@/components/tables/TableToolbar"
import { Pagination } from "@/components/tables/Pagination"
import type { Warehouse } from "@/lib/types/warehouse"

const columns: ColumnDef<Warehouse, unknown>[] = [
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
    accessorKey: "SourceSystem",
    header: "Source System",
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{getValue() as string}</span>
    ),
  },
]

interface WarehousesTableProps {
  warehouses: Warehouse[]
}

export function WarehousesTable({ warehouses }: WarehousesTableProps) {
  const [search, setSearch] = useState("")

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <TableToolbar
        title="Warehouses"
        recordCount={warehouses.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search warehouses..."
      />
      <DataTable
        data={warehouses}
        columns={columns}
        searchValue={search}
        getRowId={(row) => row.ExternalId}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        totalRecords={warehouses.length}
        pageSize={warehouses.length}
        onPageChange={() => {}}
      />
    </div>
  )
}
