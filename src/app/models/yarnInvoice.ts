import { InvoiceDCDts } from './invoiceDCDts';
import { InvoiceDts } from './invoiceDts';

export interface YarnInvoice {
  invoiceId: number;
  invoiceNo: string;
  invoiceDate: string;
  partyId: number;
  partyName: string;
  partyAddress1: string;
  partyAddress2: string;
  partyAddress3: string;
  city: string;
  district: string;
  state: string;
  stateCode: number;
  partyPinCode: string;
  partyGSTNo: string;
  invoiceDts: InvoiceDts[];
  invoiceDCDts: InvoiceDCDts[];
}
