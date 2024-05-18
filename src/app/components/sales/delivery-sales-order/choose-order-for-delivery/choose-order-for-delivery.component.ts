import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { OrdersPendingDelivery } from 'src/app/models/ordersPendingDelivery';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { ComboBoxComponent } from 'src/app/shared/combo-box/combo-box.component';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-order-for-delivery',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ComboBoxComponent,
  ],
  templateUrl: './choose-order-for-delivery.component.html',
  styleUrls: ['./choose-order-for-delivery.component.scss'],
})
export class ChooseOrderForDeliveryComponent implements OnInit, OnDestroy {
  orders: OrdersPendingDelivery[] = [];
  selection = new SelectionModel<OrdersPendingDelivery>(false, []);
  displayedColumns = [
    'orderNo',
    'orderDate',
    'counts',
    'shade',
    'blend',
    'orderQuantity',
    'deliveredQuantity',
    'balanceQuantity',
    'select',
  ];
  subscription = new Subscription();
  loader = false;
  party = new FormControl();

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService,
    public partyService: PartyService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.partyService.getSalesParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.subscription.add(
      this.party.valueChanges.subscribe((partyId) => {
        if (partyId) {
          this.loader = true;
          this.selection.clear();
          this.subscription.add(
            this.yarnService
              .getOrdersPendingDelivery(partyId)
              .pipe(finalize(() => (this.loader = false)))
              .subscribe({
                next: (data) => (this.orders = data),
                error: (error) =>
                  this.notificationService.error(
                    typeof error?.error === 'string'
                      ? error?.error
                      : error?.message
                  ),
              })
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submit() {
    if (this.party.invalid) {
      this.notificationService.notify(
        'Please select a party',
        NotifyType.ERROR
      );
      return;
    }
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select a order to continue',
        NotifyType.ERROR
      );
      return;
    }
    this.matDialogRef.close(this.selection.selected.shift());
  }

  close() {
    this.matDialogRef.close();
  }

  radioLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  selectItem(row: any) {
    this.selection.toggle(row);
  }
}
