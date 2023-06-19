import { Injectable } from '@angular/core';
import { YarnDC } from '../models/yarnDC';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  fibrePOprint = false;
  fibrePOData: any;
  yarnDCPrint = false;
  yarnDCData!: YarnDC;

  constructor() {
    window.onafterprint = () => {
      this.fibrePOprint = false;
      this.yarnDCPrint = false;
    };
  }
}
