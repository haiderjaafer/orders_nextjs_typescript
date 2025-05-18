"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { SortableHeader } from "./SortableHeader";

export type Order = {
  orderID: number;
  orderNo: string;
  orderYear: string;
  orderDate: string;
  orderType: string;
  coID: number;
  deID: number;
  materialName: string;
  estimatorID: number;
  procedureID: number;
  orderStatus: string;
  notes: string;
  achievedOrderDate: string;
  priceRequestedDestination: string;
  finalPrice: string;
  currencyType: string;
  cunnrentDate: string;
  color: string;
  checkOrderLink: boolean;
  userID: number;
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="m-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

{
    accessorKey: "orderID",
    header: ({ column }) => (
      <SortableHeader column={column} title="رقم الطلبية" sortable={false} />
    ),
    cell: ({ row }) => (
      <div className="text-center py-3">{row.getValue("orderID")}</div>
    ),
  },
  {
    accessorKey: "orderYear",
    header: ({ column }) => (
      <SortableHeader column={column} title="السنة"sortable={false} />
    ),
    cell: ({ row }) => (
      <div className="text-center py-3">{row.getValue("orderYear")}</div>
    ),
  },


  {
    accessorKey: "orderDate",
    header: ({ column }) => <SortableHeader column={column} title="تاريخ الطلبية" sortable={true} />,
    cell: ({ row }) =>
      format(new Date(row.getValue("orderDate")), "yyyy-MM-dd"),
  },

  {
    accessorKey: "orderType",
    header: ({ column }) => <SortableHeader column={column} title="نوع الطلبية" />,
    cell: ({ row }) => <div>{row.getValue("orderType")}</div>,
  },

  {
    accessorKey: "materialName",
    header: ({ column }) => <SortableHeader column={column} title="المادة" />,
    cell: ({ row }) => <div>{row.getValue("materialName")}</div>,
  },

  {
    accessorKey: "orderStatus",
    header: ({ column }) => <SortableHeader column={column} title="الحالة" />,
    cell: ({ row }) => <div>{row.getValue("orderStatus")}</div>,
  },

  {
    accessorKey: "currencyType",
    header: ({ column }) => <SortableHeader column={column} title="العملة" />,
    cell: ({ row }) => <div>{row.getValue("currencyType")}</div>,
  },

  {
    accessorKey: "finalPrice",
    header: ({ column }) => <SortableHeader column={column} title="السعر النهائي" />,
    cell: ({ row }) => <div>{row.getValue("finalPrice")}</div>,
  },

  {
    accessorKey: "priceRequestedDestination",
    header: ({ column }) => <SortableHeader column={column} title="الوجهة المطلوبة" />,
    cell: ({ row }) => <div>{row.getValue("priceRequestedDestination")}</div>,
  },

  {
    accessorKey: "notes",
    header: ({ column }) => <SortableHeader column={column} title="ملاحظات" />,
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  },

  {
    accessorKey: "achievedOrderDate",
    header: ({ column }) => <SortableHeader column={column} title="تاريخ الانجاز" />,
    cell: ({ row }) =>
      format(new Date(row.getValue("achievedOrderDate")), "yyyy-MM-dd"),
  },

  {
    accessorKey: "cunnrentDate",
    header: ({ column }) => <SortableHeader column={column} title="تاريخ الادخال" />,
    cell: ({ row }) =>
      format(new Date(row.getValue("cunnrentDate")), "yyyy-MM-dd"),
  },

{
  accessorKey: "color",
  header: ({ column }) => <SortableHeader column={column} title="اللون" />,
  cell: ({ row }) => {
    const color = row.getValue("color") as string;
    return (
      <span className={`text-${color.toLowerCase()}`}>
        {color}
      </span>
    );
  },
}
,

  {
    accessorKey: "checkOrderLink",
    header: ({ column }) => <SortableHeader column={column} title="رابط الطلبية" />,
    cell: ({ row }) =>
      row.getValue("checkOrderLink") ? "✔️" : "❌",
  },




{
    id: "actions",
    header: () => <div className="text-center">الأعمال</div>,
    cell: ({ row }) => {
      const id = row.original.orderID;
      return (
        <div className="flex items-center justify-center gap-1 py-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => alert(`Edit ${id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => alert(`Delete ${id}`)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      );
    },
  },

];





