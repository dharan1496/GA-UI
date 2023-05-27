import { YarnOrderDetails } from './yarnOrderDetails';

export interface YarnOrder {
  orderId: number;
  orderNo: string;
  orderDate: string;
  receivedDate: string;
  partyId: number;
  dueDays: number;
  brokerName: string;
  orderDts: YarnOrderDetails[];
  receivedByUserId: number;
  remarks: string;
}
