import { JSX } from "react";

import { ColumnDef } from "@tanstack/react-table";

// Define the base TableData type
export interface TableData {
  [key: string]: any;
}

// Extend ColumnDef to include size and other properties
export type AccessorColumnDef<T extends TableData> = ColumnDef<T> & {
  accessorKey: string;
  header: string;
  size?: number; // Explicitly include size
};

// HeaderMap for mapping field names to display names
export interface HeaderMap {
  [key: string]: string;
}



// API response type based on provided example
export interface Order {
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
}


export const orderHeaderMap: HeaderMap = {
  id: "المعرف",
  orderID: "رقم فريد",
  orderNo: "رقم الطلبية",
  orderYear: "السنة",
  orderDate: "تاريخ الطلبية",
  orderType: "نوع الطلبية",
  coID: "الهيأة",
  deID: "القسم",
  materialName: "اسم المادة",
  estimatorID: "اسم المخمن",
  procedureID: "الاجراء",
  orderStatus: "حالة الطلبية",
  notes: "الملاحظات",
  achievedOrderDate: "تأريخ الانجاز",
  priceRequestedDestination: "سعر الجهة الطالبة",
  finalPrice: "السعر النهائي",
  currencyType: "نوع العملة",
  cunnrentDate: "تاربخ الادخال",
  color: "اللون",
  checkOrderLink: "مرتبطة ام لا",
  userID: "المستخدم",
};