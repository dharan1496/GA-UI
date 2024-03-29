import { PartyDepartment } from './partyDepartment';

export interface Party {
  partyId: number;
  partyName: string;
  branchName: string;
  address1: string;
  address2: string;
  address3: string;
  districtName: string;
  districtId: number;
  cityName: string;
  cityId: number;
  pinCode: string;
  stateName: string;
  stateId: number;
  stateCode: number;
  gstNo: string;
  eMailId: string;
  contactNo: string;
  createdByUserId: number;
  partyDepartments: PartyDepartment[];
}
