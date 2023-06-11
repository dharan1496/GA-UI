export interface OrdersPendingDelivery {
  orderId: number;
  orderNo: string;
  orderDate: string;
  partyId: number;
  partyName: string;
  orderDtsId: number;
  countsId: number;
  counts: string;
  blendId: number;
  blendName: string;
  shadeId: number;
  shadeName: string;
  orderQuantity: number;
  rate: number;
  gstPercent: number;
  deliveredQuantity: number;
  balanceQuantity: number;
}
