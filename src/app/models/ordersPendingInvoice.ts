export interface OrdersPendingInvoice {
  orderId: number;
  orderNo: string;
  orderDate: string;
  orderDtsId: number;
  partyName: string;
  shadeName: string;
  blendName: string;
  counts: string;
  orderQuantity: number;
  deliveredQuantity: number;
  invoicedQuantity: number;
  pendingQuantity: number;
}
