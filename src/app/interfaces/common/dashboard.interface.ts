
export interface SaleDashboard {
  totalSale?: number;
  invoiceCount?: number;
  totalProfit?: number;
  totalLoss?: number;
  totalExpense?: number;
  todayTotalShippingOrders?: number;
  todayDelvedOrderAmount?: number;
  totalLowStockProducts?: number;
  monthlyDeliveredOrderAmount?: number;
  totalShippingOrders?: number;
  monthlyPaidOrderAmount?: number;
  monthlyUnpaidOrderAmount?: number;
  todayOrderCount: number;
  todayOrderAmount: number;
  weeklyOrderCount: number;
  countTodayAddedOrder: number;
  monthlyTotalOrders: number;
  todayUnpaidOrderAmount: number;
  todayPaidOrderAmount: number;
  weeklyOrderAmount: number;
  monthlyDeliveredOrders: number;
  monthlyOrderCount: number;
  monthlyOrderAmount: number;
  totalUnpaidOrderCount: number;
  totalCustomerCount: number;
  todayCustomerCount: number;
  totalPrescriptionOrderCount: number;
  totalWebReviewCount: number;
  totalPendingOrderCount: number;
  totalConfirmOrderCount: number;
  totalDeliveredOrderCount: number;
  totalCancelOrderCount: number;
  totalMaleCustomerCount: number;
  totalFemaleCustomerCount: number;
}
export interface OrderDashboard {
  todayOrderCount: number;
  todayUnpaidOrderCount: number;
  totalCashOneDeliveryOrderCount: number;
  totalOnlineOrderCount: number;
  totalPendingOrders: number;
  totalProcessingOrders: number;
  totalMaleCustomerCount: number;
  todayPaidOrderCount: number;
  totalApprovedOrders: number;
  totalShippingOrders: number;
  totalCancelOrders: number;
  totalRefundOrders: number;
  totalDeliveredOrders: number;
  totalFemaleCustomerCount: number;
  todayRequestMedicineCount: number;
  todayPrescriptionOrderCount: number;
}

export interface UserCountDashboard {
  todayCustomerCount: number;
  totalCustomerCount: number;
}
