import { YarnDCDetails } from './yarnDCDetails';

export interface YarnDC {
  dcId: number;
  dcNo: string;
  partyId: number;
  partyName: string;
  branchName: string;
  address1: string;
  address2: string;
  address3: string;
  districtName: string;
  cityName: string;
  pinCode: string;
  stateName: string;
  stateCode: number;
  gstNo: string;
  vehicleNo: string;
  remarks: string;
  deliveryPartyName: string;
  deliveryBranchName: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryAddress3: string;
  deliveryDistrictName: string;
  deliveryCityName: string;
  deliveryPinCode: string;
  deliveryStateName: string;
  deliveryStateCode: number;
  deliveryGSTNo: string;
  deliveryPartyId: number;
  yarnDetails: YarnDCDetails[];
}
