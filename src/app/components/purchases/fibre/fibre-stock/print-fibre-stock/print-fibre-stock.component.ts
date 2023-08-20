import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-print-fibre-stock',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-fibre-stock.component.html',
  styleUrls: ['./print-fibre-stock.component.scss'],
})
export class PrintFibreStockComponent {
  today = new Date();
  constructor(public printService: PrintService) {}
}
