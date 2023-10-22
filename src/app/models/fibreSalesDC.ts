import { FibreSalesDCDetails } from './fibreSalesDCDetails';

export interface FibreSalesDC {
  dcId: number;
  dcNo: string;
  partyId: number;
  partyName: string;
  dcDate: string;
  salesDCDetails: FibreSalesDCDetails[];
  createdByUserId: number;
}
