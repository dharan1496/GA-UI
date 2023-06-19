import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-print-delivery-receipt',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-delivery-receipt.component.html',
  styleUrls: ['./print-delivery-receipt.component.scss'],
})
export class PrintDeliveryReceiptComponent {
  now = new Date();

  constructor(public printService: PrintService) {}
}
