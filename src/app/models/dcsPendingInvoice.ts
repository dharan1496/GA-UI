export interface DCsPendingInvoice {
  dcId: number;
  dcNo: string;
  dcDate: string;
  orderDtsId: number;
  shadeId: number;
  shadeName: string;
  blendId: number;
  blendName: string;
  countsId: number;
  counts: string;
  deliveredQuantity: number;
  vehicleNo: string;
  remarks: string;
  rate: number;
  gstPercent: number;
}
