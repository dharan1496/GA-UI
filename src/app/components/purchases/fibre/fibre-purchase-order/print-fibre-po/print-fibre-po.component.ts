import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintFibrePOService } from './print.fibre-po.service';

@Component({
  selector: 'app-print-fibre-po',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-fibre-po.component.html',
  styleUrls: ['./print-fibre-po.component.scss'],
})
export class PrintFibrePOComponent {
  constructor(public printFibreService: PrintFibrePOService) {}

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
}
