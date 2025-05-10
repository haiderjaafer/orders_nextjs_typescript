// types.ts (or inside the same file if preferred)

// types.ts or at the top of your component file
export interface OrderFormData {
  orderNo: string;
  orderYear: string;
  orderDate: string;
  materialName: string;
  priceRequestedDestination: string;
  currencyType: string;
  finalPrice: string;
  orderType: string;
  coID: string;
  deID: string;
  estimatorID: string;
  procedureID: string;
  orderStatus: string;
  notes: string;
  achievedOrderDate: string;
  checkOrderLink: string;
  userID: string;
}

