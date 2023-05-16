import { ConversionYarn } from './conversionYarn';
import { ProgramFibresMixed } from './programFibresMixed';

export interface ConversionProgram {
  programId: number;
  programNo: string;
  programDate: string;
  shadeId: number;
  shadeName: string;
  blendId: number;
  blendName: string;
  remarks: string;
  isDeleted: boolean;
  isClosed: boolean;
  createdByUserId: number;
  closedByUserId: number;
  yarnCounts: ConversionYarn[];
  mixingSummary: ProgramFibresMixed[];
}
