export interface YarnStockByOrderId {
  programId: number;
  programNo: string;
  programDate: string;
  shadeId: number;
  shadeName: string;
  blendId: number;
  blendName: string;
  countsId: number;
  counts: string;
  productionYarnDtsId: number;
  orderDtsId: number;
  lot: string;
  productionQuantity: number;
  stockQuantity: number;
  issueQuantity: number;
}
