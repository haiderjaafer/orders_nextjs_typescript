


// app/orders/page.tsx
 "use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

import ComboBoxOrderNoComponent from "@/components/ComboBoxOrderNoComponent";
import axios from "axios";
 import { Order, orderHeaderMap } from "@/components/DynamicTableTanStack/types";

//Dynamically import DynamicTable with SSR disabled
const DynamicTable = dynamic(() => import("@/components/DynamicTableTanStack/DynamicTableComponent"), {
  ssr: false,
});

export default function OrdersPage() {
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>("");
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!selectedOrderNo) throw new Error("رقم الطلب غير محدد");
    const response = await axios.get<Order[]>(`http://127.0.0.1:8000/api/orders/${selectedOrderNo}`);
    return response.data;
  }, [selectedOrderNo]);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["orders", selectedOrderNo],
    queryFn: fetchOrders,
    enabled: fetchTriggered && !!selectedOrderNo,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = () => {
    setFetchTriggered(true);
    refetch();
  };

  return (
    <div className="p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">الطلبات</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <ComboBoxOrderNoComponent
            value={selectedOrderNo}
            onChange={(value) => setSelectedOrderNo(value)}
            fetchUrl="http://127.0.0.1:8000/api/orders/getAllForComobox"
          />
         </div>
         <Button
          onClick={handleSearch}
          disabled={!selectedOrderNo || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "جارٍ التحميل..." : "عرض الطلبيات"}
        </Button>
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-right">
          خطأ في جلب البيانات: {error.message}
        </div>
      )}
      <DynamicTable
        data={data}
        headerMap={orderHeaderMap}
        excludeFields={["checkOrderLink", "userID",]}
      />
    </div>
  );
}




