import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PrintService } from '../../services/print.service';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Subscription } from 'rxjs';
import { YarnService } from 'src/app/services/yarn.service';

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
    private printService: PrintService,
    private fibreService: FibreService,
    private notificationService: NotificationService,
    private yarnService: YarnService
  ) {}

  close() {
    this.matDialogRef.close();
  }

  printPO() {
    this.getPODetails();
  }

  printDC() {
    this.getYarnDCDdetails();
  }

  getPODetails() {
    this.subscription.add(
      this.fibreService.getPOByID(this.data?.poId).subscribe({
        next: (response) => {
          this.printService.fibrePOData = response;
          this.printService.fibrePOprint = true;
          setTimeout(() => window.print());
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  getYarnDCDdetails() {
    this.subscription.add(
      this.yarnService.getYarnDCDetailsById(this.data?.dcId).subscribe({
        next: (response) => {
          this.printService.yarnDCData = response;
          this.printService.yarnDCPrint = true;
          setTimeout(() => window.print());
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
