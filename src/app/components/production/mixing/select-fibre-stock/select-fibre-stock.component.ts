import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreStock } from 'src/app/models/fibreStock';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-select-fibre-stock',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './select-fibre-stock.component.html',
  styleUrls: ['./select-fibre-stock.component.scss'],
})
export class SelectFibreStockComponent implements OnInit, OnDestroy {
  dataSource: FibreStock[] = [];
  displayedColumns = [
    'receivedDCNo',
    'fibreCategory',
    'fibre',
    'fibreShade',
    'lot',
    'stockQty',
    'select',
  ];
  subscription = new Subscription();
  selection = new SelectionModel<FibreStock>(true, []);
  loader = false;

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private fibreService: FibreService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.loader = true;
    this.subscription.add(
      this.fibreService
        .getFibreStockForMixing(this.data)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (fibreStock) => (this.dataSource = fibreStock),
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
