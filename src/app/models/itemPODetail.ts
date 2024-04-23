export interface ItemPODetail {
  poId: number;
  poDetailId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  rate: number;
  basicAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  netAmount: number;
  discountPercent: number;
  discountAmount: number;
  totalAmount: number;
}
