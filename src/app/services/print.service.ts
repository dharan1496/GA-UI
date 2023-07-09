import { Injectable } from '@angular/core';
import { YarnDC } from '../models/yarnDC';
import { YarnInvoice } from '../models/yarnInvoice';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  fibrePOprint = false;
  fibrePOData: any;
  yarnDCPrint = false;
  yarnDCData!: YarnDC;
  yarnInvoice!: YarnInvoice;
  yarnInvoicePrint = false;

  constructor() {
    window.onafterprint = () => {
      this.fibrePOprint = false;
      this.yarnDCPrint = false;
      document.body.style.overflow = Constants.AUTO;
    };
  }
}
