import { CreateYarnInvoiceDts } from './createYarnInvoiceDts';

export interface CreateYarnInvoice {
  invoiceDate: string;
  partyId: number;
  createYarnInvoiceDts: CreateYarnInvoiceDts[];
  createdByUserId: number;
}
