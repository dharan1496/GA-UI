import { ConversionYarn } from './conversionYarn';

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
}
