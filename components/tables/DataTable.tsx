"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { MaterialIcon } from "@/components/shared/MaterialIcon";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchValue?: string;
  onRowClick?: (row: T) => void;
  activeRowId?: string | null;
  getRowId?: (row: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  searchValue = "",
  onRowClick,
  activeRowId,
  getRowId,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: searchValue },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: getRowId as any,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-surface-container-high">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" && (
                      <MaterialIcon icon="arrow_upward" className="!text-[12px]" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <MaterialIcon icon="arrow_downward" className="!text-[12px]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-white/10">
          {table.getRowModel().rows.map((row) => {
            const isActive = activeRowId && getRowId ? getRowId(row.original) === activeRowId : false;
            return (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={`transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary-container/5 border-l-2 border-primary"
                    : "hover:bg-primary-container/10"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
