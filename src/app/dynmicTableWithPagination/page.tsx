"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import ComboBoxOrderNoComponent from "@/components/ComboBoxOrderNoComponent";
import { Order, orderHeaderMap } from "@/components/DynamicTableTanStack/types";


const DynamicTable = dynamic(() => import("@/components/DynamicTableTanStack/DynamicTableWithPagination"), {
  ssr: false,
});

export default function OrdersPage() {
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchOrders = useCallback(async () => {
    const params: Record<string, any> = { page, limit };
    if (selectedOrderNo) params.orderNo = selectedOrderNo;
    if (selectedStatus) params.orderStatus = selectedStatus;

    const response = await axios.get<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("http://127.0.0.1:8000/api/orders/getAll", { params });
    return response.data;
  }, [selectedOrderNo, selectedStatus, page, limit]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders", selectedOrderNo, selectedStatus, page, limit],
    queryFn: fetchOrders,
    enabled: fetchTriggered,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = () => {
    setFetchTriggered(true);
    setPage(1);
    refetch();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setFetchTriggered(true);
    setPage(1);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFetchTriggered(true);
    refetch();
  };

  return (
    <div className="p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">الطلبات</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-end">
        {/* <div className="flex-1 w-full sm:w-auto">
          <ComboBoxOrderNoComponent
            value={selectedOrderNo}
            onChange={(value) => setSelectedOrderNo(value)}
            fetchUrl="http://127.0.0.1:8000/api/orders/getAllForComobox"
          />
        </div> */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full sm:w-48 p-2 border rounded-md bg-white text-right"
          >
            <option value="">جميع الحالات</option>
            <option value="منجز">منجز</option>
            <option value="قيد الانجاز">قيد الانجاز</option>
            <option value="الغيت">الغيت</option>
          </select>
        </div>
        <Button
          onClick={handleSearch}
          disabled={isLoading}
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
        data={data?.data || []}
        headerMap={orderHeaderMap}
        excludeFields={["checkOrderLink", "userID"]}
        pagination={{
          page: data?.page || 1,
          limit: data?.limit || 10,
          total: data?.total || 0,
          totalPages: data?.totalPages || 1,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}