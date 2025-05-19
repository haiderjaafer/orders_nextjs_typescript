"use client";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { columns, Order } from "./columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props = {
  orderNo: string;
};

export function OrderTable({ orderNo }: Props) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderNo}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <Button onClick={fetchOrders} disabled={!orderNo || loading}>
        {loading ? "جارٍ التحميل..." : "عرض الطلبيات"}
      </Button>

      <div className="min-w-[1000px] w-full border text-center">
        <Table>
          <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="align-middle text-center ">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell  key={cell.id} className="align-middle text-center py-3 px-2"> 
                   <div className=""> {flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!data.length && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
