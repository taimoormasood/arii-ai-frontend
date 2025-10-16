"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaginationWithSearchParams } from "@/hooks/use-pagination-with-search-params";
import { cn } from "@/lib/utils";

import CustomPagination from "./custom-pagination";

export interface Column<T> {
  id: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
  emptyMessage?: string;
  rowKey?: keyof T;
  module?: string;
}

export default function CustomTable<T>({
  columns,
  data,
  loading = false,
  pagination = true,
  emptyMessage = "No results found",
  rowKey,
  module = "vendors-management",
}: CustomTableProps<T>) {
  const { page, limit, total, handlePageChange, handleLimitChange } =
    usePaginationWithSearchParams("page");

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-100">
              {columns.map((col) => (
                <TableHead
                  key={String(col.id)}
                  className={cn(
                    "text-xs font-medium uppercase text-gray-600 px-4 py-3",
                    col.className
                  )}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center p-6">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowKey ? String(row[rowKey]) : rowIndex}
                  className="hover:bg-muted/50 border-gray-200 last:!border-gray-200 last:!border-b"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.id)}
                      className={cn(
                        "text-sm text-gray-600 px-4 py-4",
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(row[col.id], row)
                        : (row[col.id] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <CustomPagination
          page={page}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
