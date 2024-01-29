import { ReceiveFibrePODts } from './receiveFibrePODts';

export interface ReceiveFibrePO {
  receivedDCId: number;
  recdDCNo: string;
  recdDate: string;
  dcDate: string;
  partyId: number;
  partyName: string;
  receivedByUserId: number;
  fibrePODts: ReceiveFibrePODts[];
}
