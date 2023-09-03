import { Injectable } from '@angular/core';
import { YarnDC } from '../models/yarnDC';
import { YarnInvoice } from '../models/yarnInvoice';
import { FibreStock } from '../models/fibreStock';
import { ConversionProgram } from '../models/conversionProgram';
import { ProgramWaste } from '../models/programWaste';

export interface YarnRecoveryDetails {
  programDetails: ConversionProgram;
  wasteDetails: ProgramWaste[];
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  fibrePOprint = false;
  fibrePOData: any;
  fibreStockPrint = false;
  fibreStocks!: FibreStock[];
  fibreStockAsOnDate!: string;
  fibreStockConversionOnly = false;
  yarnDCPrint = false;
  yarnDCData!: YarnDC;
  yarnInvoice!: YarnInvoice;
  yarnInvoicePrint = false;
  yarnRecoveryPrint = false;
  yarnRecoveryDetails!: YarnRecoveryDetails;

  constructor() {
    window.onafterprint = () => {
      this.fibrePOprint = false;
      this.yarnDCPrint = false;
      this.fibreStockPrint = false;
      this.yarnRecoveryPrint = false;
    };
  }
}
