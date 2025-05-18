"use client"
import ComboBoxOrderNoComponent from "@/components/ComboBoxOrderNoComponent";
import { OrderTable } from "@/components/tanstackTable/OrderTable";
import React, { useState } from "react";



export default function Home() {
  const [selectedOrderNo, setSelectedOrderNo] = useState("");

  return(
    <div>
   <div>{selectedOrderNo}</div>
  <ComboBoxOrderNoComponent
        value={selectedOrderNo}
        onChange={(value) => setSelectedOrderNo(value)} // Must be a function
        fetchUrl="http://127.0.0.1:8000/api/orders/getAll"
      />
    
     <OrderTable orderNo={selectedOrderNo} />

    </div>
  )

}
