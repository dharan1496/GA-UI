import { ProductionYarn } from './productionYarn';

export interface ProductionEntry {
  programId: number;
  mixingId: number;
  productionDate: string;
  nullable: true;
  yarnDetails: ProductionYarn[];
  createdByUserId: number;
}
