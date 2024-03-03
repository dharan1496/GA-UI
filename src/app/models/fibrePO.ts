import { FibrePODts } from './fibrePODts';

export interface FibrePO {
  fibrePoid: number;
  podate: string;
  pono: string;
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
  fibrePODts: FibrePODts[];
  isPOClosed: boolean;
}
