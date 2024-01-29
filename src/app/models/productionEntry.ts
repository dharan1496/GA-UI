import { ProductionYarn } from './productionYarn';

export interface ProductionEntry {
  programId: number;
  mixingId: number;
  productionDate: string;
  yarnDetails: ProductionYarn[];
  createdByUserId: number;
  productionId: number;
  programNo: string;
  programDate: string;
  shadeId: number;
  shadeName: string;
  blendId: number;
  blendName: string;
}
