import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PrintFibrePOService } from '../purchases/fibre/fibre-purchase-order/print-fibre-po/print.fibre-po.service';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss'],
})
export class SuccessDialogComponent implements OnDestroy {
  banner = true;
  subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<void>,
    private printFibrePOService: PrintFibrePOService,
    private fibreService: FibreService,
    private notificationService: NotificationService
  ) {}

  close() {
    this.matDialogRef.close();
  }

  printPO() {
    this.getPODetails();
  }

  getPODetails() {
    this.subscription.add(
      this.fibreService.getPOByID(this.data?.poId).subscribe({
        next: (response) => {
          this.printFibrePOService.fibrePOData = response;
          this.printFibrePOService.print = true;
          setTimeout(() => window.print());
        },
        error: (error) => this.notificationService.error(error.message),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
