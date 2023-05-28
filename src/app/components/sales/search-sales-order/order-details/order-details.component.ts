import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { MaterialModule } from 'src/app/material.module';
import { YarnOrder } from 'src/app/models/yarnOrder';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnDestroy {
  subscription = new Subscription();
  columnsToDisplay = [
    'counts',
    'shade',
    'blend',
    'orderQty',
    'rate',
    'amount',
    'gstPercent',
    'totalAmount',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public orderDetails: YarnOrder,
    private partyService: PartyService,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateOrder() {
    sessionStorage.setItem('order', JSON.stringify(this.orderDetails));
    this.router.navigateByUrl('sales/update-order');
    this.matDialogRef.close();
  }

  closeOrder() {
    this.subscription.add(
      this.dialog
        .open(UserActionConfirmationComponent)
        .afterClosed()
        .subscribe((response) => {
          if (response) {
            const closeOrder = {
              orderId: this.orderDetails.orderId,
              closedByUserId: 0,
            };
            this.subscription.add(
              this.yarnService.closeYarnOrder(closeOrder).subscribe({
                next: (response) => this.notificationService.success(response),
                error: (error) => {
                  this.notificationService.error(
                    typeof error?.error === 'string'
                      ? error?.error
                      : error?.message
                  );
                },
              })
            );
          }
        })
    );
  }

  reopenOrder() {
    const reopenOrder = {
      orderId: this.orderDetails.orderId,
      reopenedByUserId: 0,
    };
    this.subscription.add(
      this.yarnService.reopenYarnOrder(reopenOrder).subscribe({
        next: (response) => this.notificationService.success(response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  close() {
    this.matDialogRef.close();
  }

  getParty(id: number): string {
    return (
      this.partyService.parties.find((party) => party.partyId === id)
        ?.partyName || ''
    );
  }

  getAmount() {
    return this.orderDetails.orderDts
      .map((data: any) => data?.rate * data?.orderQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTaxAmount() {
    return this.orderDetails.orderDts
      .map(
        (data: any) =>
          (data?.rate * data?.orderQuantity * data?.gstPercent) / 100
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.orderDetails.orderDts
      .map(
        (data: any) =>
          (data?.rate * data?.orderQuantity * data?.gstPercent) / 100 +
          data.rate * data.orderQuantity
      )
      .reduce((acc, value) => acc + value, 0);
  }
}
