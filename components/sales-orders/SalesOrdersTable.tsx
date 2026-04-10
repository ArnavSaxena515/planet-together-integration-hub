"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/tables/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MaterialIcon } from "@/components/shared/MaterialIcon";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { SalesOrder } from "@/lib/types/sales-order";
import type { StatusCode } from "@/lib/utils/status";

const columns: ColumnDef<SalesOrder, unknown>[] = [
  {
    id: "select",
    header: () => <input type="checkbox" className="rounded-sm border-outline-variant text-primary focus:ring-primary/20" />,
    cell: () => (
      <input
        type="checkbox"
        className="rounded-sm border-outline-variant text-primary"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    size: 40,
    enableSorting: false,
  },
  {
    accessorKey: "salesOrderNumber",
    header: "Order #",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-primary">#{row.original.salesOrderNumber}</span>
    ),
  },
  {
    accessorKey: "salesOrderType",
    header: "Type",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "salesOrganization",
    header: "Sales Org",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "distributionChannel",
    header: "Dist. Channel",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "customerExternalId",
    header: "Customer ID",
    cell: ({ getValue }) => <span className="text-xs text-on-surface-variant">{getValue() as string}</span>,
  },
  {
    accessorKey: "requestedDeliveryDate",
    header: "Delivery Date",
    cell: ({ getValue }) => (
      <span className="text-xs text-on-surface-variant">{formatDate(getValue() as string)}</span>
    ),
  },
  {
    accessorKey: "totalNetAmount",
    header: () => <span className="text-right w-full block">Net Amount</span>,
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-on-surface text-right block">
        {formatCurrency(row.original.totalNetAmount, row.original.transactionCurrency)}
      </span>
    ),
  },
  {
    accessorKey: "sapProcessStatus",
    header: () => <span className="text-center w-full block">Process Status</span>,
    cell: ({ getValue }) => (
      <div className="text-center">
        <StatusBadge code={(getValue() as string) as StatusCode} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right w-full block">Actions</span>,
    cell: () => (
      <div className="text-right">
        <button className="p-1 hover:text-primary">
          <MaterialIcon icon="more_vert" className="text-base" />
        </button>
      </div>
    ),
    enableSorting: false,
  },
];

interface SalesOrdersTableProps {
  orders: SalesOrder[];
}

export function SalesOrdersTable({ orders }: SalesOrdersTableProps) {
  const [search, setSearch] = useState("");
  const { openSlideOver, activeOrderId } = useAppStore();

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <TableToolbar
        title="Sales Orders"
        recordCount={orders.length}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search orders..."
      />
      <DataTable
        data={orders}
        columns={columns}
        searchValue={search}
        onRowClick={(row) => openSlideOver(row.externalId)}
        activeRowId={activeOrderId}
        getRowId={(row) => row.externalId}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        totalRecords={orders.length}
        pageSize={orders.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
