import { YarnReturnDetails } from './yarnReturnDetails';

export interface YarnReturn {
  returnId: number;
  returnDate: string;
  returnDCNo: string;
  partyNo: number;
  returnReason: string;
  remarks: string;
  yarnReturnDetails: YarnReturnDetails[];
}
