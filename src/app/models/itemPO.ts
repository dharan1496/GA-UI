import { ItemPODetail } from './ItemPODetail';

export interface ItemPO {
  poId: number;
  poDate: string;
  poNumber: string;
  partyId: number;
  partyName: string;
  branchName: string;
  address1: string;
  address2: string;
  address3: string;
  districtName: string;
  cityName: string;
  stateName: string;
  gstCode: number;
  gstNo: string;
  eMailId: string;
  advanceAmount: number;
  itemPODetail: ItemPODetail[];
}
