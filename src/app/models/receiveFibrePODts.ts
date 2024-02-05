export interface ReceiveFibrePODts {
  receivedDCId: number;
  receivedDtsId: number;
  poDtsId: number;
  poNo: string;
  poDate?: string;
  fiberTypeId: number;
  fiberTypeName: string;
  fiberShadeId: number;
  fiberShadeName: string;
  lot: string;
  hsnCode: number;
  orderQty?: number;
  receivedWeight: number;
  receivedBales: number;
  rate: number;
  gstPercent: number;
}
