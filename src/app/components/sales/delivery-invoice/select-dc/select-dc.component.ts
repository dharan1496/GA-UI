import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DCsPendingInvoice } from 'src/app/models/dcsPendingInvoice';
import { NotifyType } from 'src/app/models/notify';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-select-dc',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './select-dc.component.html',
  styleUrls: ['./select-dc.component.scss'],
})
export class SelectDcComponent implements OnInit, OnDestroy {
  dataSource: DCsPendingInvoice[] = [];
  displayedColumns = [
    'dcNo',
    'dcDate',
    'counts',
    'shade',
    'blend',
    'deliveredQuantity',
    'rate',
    'gstPercent',
    'select',
  ];
  subscription = new Subscription();
  selection = new SelectionModel<DCsPendingInvoice>(true, []);
  loader = false;

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService,
    @Inject(MAT_DIALOG_DATA) private orderId: string
  ) {}

  ngOnInit() {
    this.loader = true;
    this.subscription.add(
      this.yarnService
        .ordersPendingInvoiceByOrderId(+this.orderId)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (stock) => (this.dataSource = stock),
          error: (error) => {
            this.dataSource = [];
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
          },
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  submit() {
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select atleast one stock to proceed',
        NotifyType.ERROR
      );
      return;
    }

    this.matDialogRef.close(this.selection.selected);
  }

  close() {
    this.matDialogRef.close();
  }
}
