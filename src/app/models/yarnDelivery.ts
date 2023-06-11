import { YarnDeliveryDts } from './yarnDelivertDts';

export interface YarnDelivery {
  dcId: number;
  dcNo: string;
  deliveryDate: string;
  orderId: number;
  orderDtsId: number;
  shadeId: number;
  blendId: number;
  countsId: number;
  vehicleNo: string;
  remarks: string;
  createdByUserId: number;
  deliveryDts: YarnDeliveryDts[];
}
