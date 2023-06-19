import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { YarnDeliverySummary } from 'src/app/models/yarnDeliverySummary';
import { PrintService } from 'src/app/services/print.service';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
})
export class DeliveryDetailsComponent implements OnInit {
  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public deliveryDetails: YarnDeliverySummary,
    private matDialogRef: MatDialogRef<any>,
    private printService: PrintService,
    private yarnService: YarnService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.yarnService
        .getYarnDCDetailsById(this.deliveryDetails.dcId.toString())
        .subscribe({
          next: (response) => {
            this.printService.yarnDCData = response;
            this.printService.yarnDCPrint = true;
          },
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  close() {
    this.printService.yarnDCPrint = false;
    this.matDialogRef.close();
  }

  printDC() {
    this.printService.yarnDCPrint = true;
    setTimeout(() => window.print());
  }
}
