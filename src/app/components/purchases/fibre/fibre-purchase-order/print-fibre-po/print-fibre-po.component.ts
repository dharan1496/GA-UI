import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from '../../../../../services/print.service';

@Component({
  selector: 'app-print-fibre-po',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-fibre-po.component.html',
  styleUrls: ['./print-fibre-po.component.scss'],
})
export class PrintFibrePOComponent {
  constructor(
    public printFibreService: PrintService,
    private currencyPipe: CurrencyPipe
  ) {}

  getAmount() {
    return this.printFibreService.fibrePOData?.fibrePODts
      .map((data: any) => data?.rate * data?.weight)
      .reduce((acc: number, value: number) => acc + value, 0);
  }

  getTaxAmount() {
    return this.printFibreService.fibrePOData?.fibrePODts
      .map((data: any) => (data?.rate * data?.weight * data?.gstpercent) / 100)
      .reduce((acc: number, value: number) => acc + value, 0);
  }

  getTotalAmount() {
    return this.printFibreService.fibrePOData?.fibrePODts
      .map(
        (data: any) =>
          data?.rate * data?.weight +
          (data?.rate * data?.weight * data?.gstpercent) / 100
      )
      .reduce((acc: number, value: number) => acc + value, 0);
  }

  getRoundTotal() {
    return Math.round(this.getTotalAmount());
  }

  getRoundOffAmount() {
    const roundOff = this.getRoundTotal() - this.getTotalAmount();
    if (roundOff < 0) {
      return `- ${this.currencyPipe.transform(Math.abs(roundOff), 'INR')}`;
    }
    if (roundOff > 0) {
      return `+ ${this.currencyPipe.transform(roundOff, 'INR')}`;
    }
    return this.currencyPipe.transform(roundOff, 'INR');
  }
}
