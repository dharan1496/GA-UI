import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreWasteStock } from 'src/app/models/fibreWasteStock';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-sales-waste-order-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, DecimalDirective],
  templateUrl: './sales-waste-order-dialog.component.html',
  styleUrls: ['./sales-waste-order-dialog.component.scss'],
})
export class SalesWasteOrderDialogComponent {
  dataSource: FibreWasteStock[] = [];
  displayedColumns = ['wasteCategoryName', 'stockQuantity', 'select'];
  subscription = new Subscription();
  selection = new SelectionModel<FibreWasteStock>(true, []);
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
        .getFibreWasteStock()
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
    const stock = this.selection.selected?.map((item) => ({
      wasteCategoryName: item.wasteCategoryName,
      wasteCategoryId: item.wasteCategoryId,
      quantity: item.stockQuantity,
    }));
    this.matDialogRef.close();
  }

  close() {
    this.matDialogRef.close();
  }
}
