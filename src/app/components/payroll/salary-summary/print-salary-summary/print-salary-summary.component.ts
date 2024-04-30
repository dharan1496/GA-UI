import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-print-salary-summary',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-salary-summary.component.html',
  styleUrls: ['./print-salary-summary.component.scss'],
})
export class PrintSalarySummaryComponent {
  constructor(public printService: PrintService) {}
}
