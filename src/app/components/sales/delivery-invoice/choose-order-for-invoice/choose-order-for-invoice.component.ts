import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { OrdersPendingDelivery } from 'src/app/models/ordersPendingDelivery';
import { OrdersPendingInvoice } from 'src/app/models/ordersPendingInvoice';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { PartyComboBoxComponent } from 'src/app/shared/party-combo-box/party-combo-box.component';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-order-for-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    PartyComboBoxComponent,
  ],
  templateUrl: './choose-order-for-invoice.component.html',
  styleUrls: ['./choose-order-for-invoice.component.scss'],
})
export class ChooseOrderForInvoiceComponent implements OnInit, OnDestroy {
  orders: OrdersPendingInvoice[] = [];
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
    'invoicedQuantity',
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
              .ordersPendingInvoiceByPartyId(partyId)
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
    this.matDialogRef.close({
      selected: this.selection.selected.shift(),
      partyId: this.party.value,
    });
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
