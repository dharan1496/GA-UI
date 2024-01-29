import { YarnDeliveryDts } from './yarnDelivertDts';

export interface YarnDelivery {
  dcNo: string;
  deliveryDate: string;
  orderId: number;
  deliveryPartyId: number;
  deliveryAddressId: number;
  vehicleNo: string;
  remarks: string;
  eWayBillNo: string;
  createdByUserId: number;
  deliveryDts: YarnDeliveryDts[];
}
