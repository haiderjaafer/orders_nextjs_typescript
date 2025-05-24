"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useMediaQuery } from "react-responsive";
import { AccessorColumnDef, HeaderMap, TableData } from "./types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DynamicTableProps<T extends TableData> {
  data: T[];
  headerMap?: HeaderMap;
  excludeFields?: string[];
  pagination?: Pagination;
}

export default function DynamicTable<T extends TableData>({
  data,
  headerMap = {},
  excludeFields = [],
  pagination,
}: DynamicTableProps<T>) {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 640 }) && isMounted;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to truncate notes to 3 words
  const truncateToThreeWords = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 3) return text;
    return `${words.slice(0, 3).join(" ")}...`;
  };

  // Helper function to determine background color class based on color field
const getStatusBackgroundColor = (color: string) => {
  switch (color?.toUpperCase()) {
    case "RED":
      return "bg-red-200 text-black text-lg font-extrabold ";
    case "YELLOW":
      return "bg-yellow-200 text-black text-lg font-extrabold ";
    case "GREEN":
      return "bg-green-200 text-black text-lg font-extrabold ";
    default:
      return "bg-gray-200 text-gray-700 text-lg font-extrabold ";
  }
};

  const columns = useMemo<ColumnDef<T>[]>(() => {
    if (data.length === 0) return [];

    const firstItem = data[0];
    const generatedColumns = Object.keys(firstItem)
      .filter((key) => !excludeFields.includes(key))
      .map((key) => {
        const columnDef: AccessorColumnDef<T> = {
          accessorKey: key,
          header: headerMap[key] || key,
          cell: ({ row }) => {
            const value = row.getValue(key) as string | number | boolean;
            const valueStr = String(value);

            // Special handling for "notes" (الملاحظات) field
            if (key === "notes") {
              const truncatedText = truncateToThreeWords(valueStr);
              return (
                <div className="text-right max-w-[200px] relative group">
                  <span className="truncate block">{truncatedText}</span>
                  {/* Custom Tooltip */}
                  <span className="absolute z-10 right-0 top-full mt-1 p-2 bg-gray-800 text-white text-sm font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-pre-wrap max-w-xs">
                    {valueStr}
                  </span>
                </div>
              );
            }

            // Special handling for "orderStatus" field to apply background color
            if (key === "orderStatus") {
              const color = row.getValue("color") as string; // Get the color value from the same row
              const bgColorClass = getStatusBackgroundColor(color);
              return (
                <div
                  className={`text-right px-2 py-1 rounded-lg w-20 ${bgColorClass}`}
                >
                  {valueStr}
                </div>
              );
            }

            return <div className="text-right">{valueStr}</div>;
          },
          size: 0, // Default size, will be overridden
        };

        // Assign specific widths to columns
        if (key === "notes") {
          columnDef.size = 200;
        } else if (["orderNo", "orderDate", "orderYear", "orderStatus"].includes(key)) {
          columnDef.size = 100;
        } else {
          columnDef.size = 120;
        }

        return columnDef;
      });

    const actionColumn: ColumnDef<T> = {
      id: "actions",
      header: "تعديل",
      size: 80,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedRecord(row.original);
              setOpenDialog(true);
            }}
          >
            تعديل
          </Button>
        </div>
      ),
    };

    return [...generatedColumns, actionColumn];
  }, [data, headerMap, excludeFields]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 120,
      minSize: 50,
      maxSize: 400,
    },
  });

  // Pagination UI
  const renderPagination = () => {
    if (!pagination) return null;

    const { page, totalPages, onPageChange } = pagination;
    const pageButtons = [];

    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          onClick={() => onPageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-center mt-4 gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          السابق
        </Button>
        {pageButtons}
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          التالي
        </Button>
      </div>
    );
  };

  // Desktop view
  if (!isMounted || !isMobile) {
    return (
      <div className="overflow-x-auto p-4" dir="rtl">
        {data.length === 0 ? (
          <div className="p-4 text-gray-500 text-right">
            لا توجد بيانات متاحة
          </div>
        ) : (
          <table
            className="min-w-full table-auto border-collapse border border-gray-200"
            style={{ width: table.getTotalSize() }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-right text-sm font-medium text-gray-900 border border-gray-200"
                      style={{
                        width: header.column.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-right text-sm text-gray-700 border border-gray-200"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {renderPagination()}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                تعديل الطلبية
              </DialogTitle>
            </DialogHeader>
            {selectedRecord ? (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto text-right">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b pb-1 text-sm"
                  >
                    <span className="font-medium text-gray-800">
                      {headerMap[key] || key}:
                    </span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>لا توجد بيانات</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Mobile view (updated to apply background color to orderStatus)
  return (
    <div className="space-y-4 p-4">
      {data.length === 0 ? (
        <div className="p-4 text-gray-500 text-right">لا توجد بيانات متاحة</div>
      ) : (
        data.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-md bg-white shadow-sm"
            dir="rtl"
          >
            {columns.map((column) => {
              if (
                "accessorKey" in column &&
                typeof column.accessorKey === "string"
              ) {
                const value = item[column.accessorKey as keyof T] as
                  | string
                  | number
                  | boolean;
                const valueStr = String(value);

                // Special handling for "orderStatus" in mobile view
                if (column.accessorKey === "orderStatus") {
                  const color = item["color"] as string;
                  const bgColorClass = getStatusBackgroundColor(color);
                  return (
                    <div
                      key={column.accessorKey}
                      className="mb-2 flex justify-between"
                    >
                      <strong className="text-gray-900">
                        {column.header as string}:
                      </strong>
                      <span
                        className={`text-gray-700 px-2 py-1 rounded ${bgColorClass}`}
                      >
                        {valueStr}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={column.accessorKey}
                    className="mb-2 flex justify-between"
                  >
                    <strong className="text-gray-900">
                      {column.header as string}:
                    </strong>
                    <span className="text-gray-700">{valueStr}</span>
                  </div>
                );
              }
              if (column.id === "actions") {
                return (
                  <div key="actions" className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRecord(item);
                        setOpenDialog(true);
                      }}
                    >
                      تعديل
                    </Button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))
      )}
      {renderPagination()}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              تعديل الطلبية
            </DialogTitle>
          </DialogHeader>
          {selectedRecord ? (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto text-right">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {headerMap[key] || key}:
                  </span>
                  <span className="text-gray-600">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>لا توجد بيانات</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}