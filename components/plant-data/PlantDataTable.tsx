"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/DataTable"
import { TableToolbar } from "@/components/tables/TableToolbar"
import { Pagination } from "@/components/tables/Pagination"
import type { PlantWarehouse } from "@/lib/types/plant-warehouse"

const columns: ColumnDef<PlantWarehouse, unknown>[] = [
  {
    accessorKey: "WarehouseExternalId",
    header: "Warehouse ID",
    cell: ({ getValue }) => <span className="text-xs font-bold text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: "PlantExternalId",
    header: "Plant ID",
    cell: ({ getValue }) => <span className="text-xs font-bold text-primary">{getValue() as string}</span>,
  },
  {
    accessorKey: "SourceSystem",
    header: "Source System",
    cell: ({ getValue }) => (
      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{getValue() as string}</span>
    ),
  },
]

interface PlantDataTableProps {
  plantWarehouses: PlantWarehouse[]
}

export function PlantDataTable({ plantWarehouses }: PlantDataTableProps) {
  const [search, setSearch] = useState("")

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <TableToolbar
        title="Plant Data"
        recordCount={plantWarehouses.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search plant data..."
      />
      <DataTable
        data={plantWarehouses}
        columns={columns}
        searchValue={search}
        getRowId={(row) => `${row.WarehouseExternalId}::${row.PlantExternalId}`}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        totalRecords={plantWarehouses.length}
        pageSize={plantWarehouses.length}
        onPageChange={() => {}}
      />
    </div>
  )
}
