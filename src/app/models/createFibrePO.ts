import { CreateFibrePODts } from './createFibrePODts';

export interface CreateFibrePO {
  pOdate: string;
  poNo: number;
  partyId: number;
  createdBy: number;
  fibrePODts: CreateFibrePODts[];
}
