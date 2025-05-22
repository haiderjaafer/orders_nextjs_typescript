// function page() {
//   return (
//     <div>page</div>
//   )
// }
// export default page

import DynamicTable from "@/components/DynamicTableTanStack/DynamicTableComponent";
import { orderHeaderMap, TableData } from "@/components/DynamicTableTanStack/types";






export default function OrdersPage() {
  const orders: TableData[] = [
    {
      id: "1",
  orderID: "1",
  orderNo: "123123",
  orderYear: "2025",
  orderDate: "2025-04-08",
  orderType: "خارجية-احتكارية",
  coID: "6",
  deID: "40",
  materialName: "مواد احتياطية مضخات وحدة الازمرة",
  estimatorID: "11",
  procedureID: "1",
  orderStatus: "منجز",
  notes: "تم زيادة قيمه الكلفه التخمنية من قبل القسم الطالب ثم اعادة الينا بعد رفع الكلفه الى قسم الخدمات الهندسية بتاريخ 2-11-202اعيدت الى التخمين بتاريخ 16-11-2022",
  achievedOrderDate: "2025-05-09",
  priceRequestedDestination: "330,000,000",
  finalPrice: "700,000,000",
  currencyType: "دولار امريكي",
  cunnrentDate: "2025-01-22",
  color: "GREEN",
  checkOrderLink: "False",
  userID: "2",

    },
 
  
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">الطلبات</h1>
      <DynamicTable data={orders} headerMap={orderHeaderMap} />
    </div>
  );
}