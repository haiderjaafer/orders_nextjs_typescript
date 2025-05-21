"use client";

// types/index.ts
export type TableData = Record<string, any>; // Any object with string keys

// Header mapping type for Arabic translations
export type HeaderMap = Record<string, string>;


// Explicitly type ColumnDef with accessorKey
export type AccessorColumnDef<T> = {
  accessorKey: keyof T & string;
  header: string;
  cell: (props: { row: { getValue: (key: string) => any } }) => JSX.Element;
};

// lib/headerMap.ts


export const orderHeaderMap: HeaderMap = {
  id: "المعرف",
  orderNo: "رقم الطلبية",
  orderDate: "تاريخ الطلب",
  price: "السعر",
  orderStatus: "حالة الطلب",
  CurrencyType : "نوع العملة",
  Notes:"الملاحظات",
};

export const userHeaderMap: HeaderMap = {
  id: "المعرف",
  username: "اسم المستخدم",
  password: "كلمة المرور", // Won't be displayed
  userDate: "تاريخ المستخدم",
};



// components/DynamicTable.tsx


import { JSX, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useMediaQuery } from "react-responsive";
import { Currency } from "lucide-react";
//import { TableData, HeaderMap, AccessorColumnDef } from "@/types";

interface DynamicTableProps<T extends TableData> {
  data: T[];
  headerMap?: HeaderMap;
  excludeFields?: string[];
}

export default function DynamicTable<T extends TableData>({
  data,
  headerMap = {},
  excludeFields = [],
}: DynamicTableProps<T>) {
  // Generate columns dynamically
  const columns = useMemo<ColumnDef<T>[]>(
    () => {
      if (data.length === 0) return [];

      const firstItem = data[0];
      return Object.keys(firstItem)
        .filter((key) => !excludeFields.includes(key))
        .map((key) => ({
          accessorKey: key,
          header: headerMap[key] || key,
          cell: ({ row }) => (
            <div className="text-right">
              {row.getValue(key) as string | number}
            </div>
          ),
        } as AccessorColumnDef<T>)); // Explicitly cast to ensure accessorKey
    },
    [data, headerMap, excludeFields]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Check if the screen is mobile
  const isMobile = useMediaQuery({ maxWidth: 640 });

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            dir="rtl"
          >
            {columns.map((column) => {
              // Type guard to ensure accessorKey exists
              if ("accessorKey" in column && typeof column.accessorKey === "string") {
                return (
                  <div
                    key={column.accessorKey}
                    className="mb-2 flex justify-between"
                  >
                    <strong className="text-gray-900">
                      {column.header as string}:
                    </strong>
                    <span className="text-gray-700">
                      {item[column.accessorKey as keyof T] as string | number}
                    </span>
                  </div>
                );
              }
              return null; // Skip columns without accessorKey
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4" dir="rtl">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-right text-sm font-medium text-gray-900 border border-gray-200"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}