"use client";

import { MaterialIcon } from "@/components/shared/MaterialIcon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="px-6 py-3 bg-surface-container-low/50 flex items-center justify-between border-t border-slate-200/10">
      <p className="text-[10px] text-slate-500 font-bold uppercase">
        Showing {start}-{end} of {totalRecords} Results
      </p>
      <div className="flex items-center gap-1">
        <button
          className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <MaterialIcon icon="chevron_left" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-xs font-bold rounded ${
              page === currentPage
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <MaterialIcon icon="chevron_right" />
        </button>
      </div>
    </div>
  );
}
