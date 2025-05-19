// schema/orderSchema.ts
import { z } from "zod";

export const orderSchema = z.object({
  orderNo: z.string().min(1, "رقم الطلبية مطلوب"),
  orderYear: z.string().min(1, "سنة الطلبية مطلوبة"),
  orderDate: z.string().min(1, "تاريخ الطلبية مطلوب"),

  materialName: z.string().min(1, "اسم المادة مطلوب"),
  priceRequestedDestination: z.string().min(1, "الوجهة المطلوبة مطلوبة"),
  currencyType: z.string().min(1, "نوع العملة مطلوب"),
  finalPrice: z.string().min(1, "السعر النهائي مطلوب"),

  orderType: z.string().min(1, "نوع الطلبية مطلوب"),
  coID: z.string().min(1, "اللجنة مطلوبة"),
  deID: z.string().min(1, "القسم مطلوب"),
  estimatorID: z.string().min(1, "اسم المخمن مطلوب"),
  procedureID: z.string().min(1, "الإجراء مطلوب"),

  orderStatus: z.string().min(1, "حالة الطلبية مطلوبة"),
  notes: z.string().optional(), // optional if notes are not required
  achievedOrderDate: z.string().min(1, "تاريخ الإنجاز مطلوب"),
  checkOrderLink: z.string().optional(),

  userID: z.string().min(1, "رقم المستخدم مطلوب"),
});
