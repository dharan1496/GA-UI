import { FibreIssued } from './fibreIssued';

export interface FibreMixing {
  programId: number;
  mixingDate: string;
  fibres: FibreIssued[];
  issuedByUseId: number;
}
