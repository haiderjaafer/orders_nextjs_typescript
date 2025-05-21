// function page() {
//   return (
//     <div>page</div>
//   )
// }
// export default page

import DynamicTable, { orderHeaderMap, TableData } from "@/components/tast_Table";




export default function OrdersPage() {
  const orders: TableData[] = [
    {
      id: 1,
      orderNo: "ORD001",
      orderDate: "2025-05-20",
      price: 99.99,
      orderStatus: "Shipped",
      CurrencyType:"دولار",
      Notes:"kkkkkkkkkzdvdlvkdlvcx/.v,cx/.v,xc/.v,cx/.v,c./v,c.v/",

    },
    {
      id: 2,
      orderNo: "ORD002",
      orderDate: "2025-05-21",
      price: 149.99,
      orderStatus: "Pending",
      CurrencyType:"يورو",
      Notes:"zfSDOFd[spfoDp[volcx;'vLC;x'VLC:<VC,vc/. b,vc /b.c<Vgpfdokgfdogfg",
    },
     {
      id: 3,
      orderNo: "ORD003",
      orderDate: "2025-05-21",
      price: 149.99,
      orderStatus: "Pending",
      CurrencyType:"دولار امريكي",
      Notes:"asdarsdfkdl;vkxcl;vkfdgdfogkfogfkgofkgflgkflgkfglfkglfkgfbv",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">الطلبات</h1>
      <DynamicTable data={orders} headerMap={orderHeaderMap} />
    </div>
  );
}