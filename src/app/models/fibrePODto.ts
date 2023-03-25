import { FibrePODtsDto } from "./fibrePODtsDto";

export interface FibrePODto {
    fibrePoid: number;
    podate: string;
    pono: number;
    partyId: number;
    partyName: number;
    createdBy: number;
    fibrePODts: FibrePODtsDto[];
}