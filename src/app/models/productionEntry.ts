import { ProductionYarn } from './productionYarn';

export interface ProductionEntry {
  programId: number;
  mixingId: number;
  productionDate: string;
  yarnDetails: ProductionYarn[];
  createdByUserId: number;
}
