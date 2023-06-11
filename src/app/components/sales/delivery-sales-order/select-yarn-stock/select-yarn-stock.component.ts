import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { YarnStockByOrderId } from 'src/app/models/yarnStockByOrderId';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-select-yarn-stock',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './select-yarn-stock.component.html',
  styleUrls: ['./select-yarn-stock.component.scss'],
})
export class SelectYarnStockComponent implements OnInit, OnDestroy {
  dataSource: YarnStockByOrderId[] = [];
  displayedColumns = [
    'programNo',
    'programDate',
    'counts',
    'shade',
    'blend',
    'lot',
    'productionQuantity',
    'stockQuantity',
    'select',
  ];
  subscription = new Subscription();
  selection = new SelectionModel<YarnStockByOrderId>(true, []);
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
        .getYarnStockByOrderId(this.orderId)
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
