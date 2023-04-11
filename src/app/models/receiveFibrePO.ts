import { ReceiveFibrePODts } from './receiveFibrePODts';

export interface ReceiveFibrePO {
  recdDCNo: string;
  recdDate: string;
  dcDate: string;
  partyId: number;
  receivedByUserId: number;
  fibrePODts: ReceiveFibrePODts[];
}
