import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-print-recovery-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './print-recovery-details.component.html',
  styleUrls: ['./print-recovery-details.component.scss'],
})
export class PrintRecoveryDetailsComponent {
  today = new Date();
  constructor(public printService: PrintService) {}
}
