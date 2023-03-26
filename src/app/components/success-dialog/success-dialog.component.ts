import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PrintFibrePOService } from '../purchases/fibre/fibre-purchase-order/print-fibre-po/print.fibre-po.service';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
  banner = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<void>,
    private printFibrePOService: PrintFibrePOService,
  ) {}

  close() {
    this.matDialogRef.close();
  }

  printPO() {
    this.printFibrePOService.print = true;
    setTimeout(() => window.print());
  }
}
