import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NavigationService } from 'src/app/navigation/navigation.service';
import { NotificationService } from 'src/app/notification-snackbar/notification.service';
import { PURCHASE } from 'src/constants/purchase-menu-values.const';
import { ReceiveOrderDetailsComponent } from './receive-order-details/receive-order-details.component';

@Component({
  selector: 'app-fibre-receive-purchase-order',
  templateUrl: './fibre-receive-purchase-order.component.html',
  styleUrls: ['./fibre-receive-purchase-order.component.scss']
})
export class FibreReceivePurchaseOrderComponent {
  form!: FormGroup;
  displayedColumns: string[] = ['select', 'fibre', 'hsnCode', 'orderQty', 'pendingQty', 'receivedQty', 'receivedBales', 'lot', 'rate', 'amount', 'gst', 'totalAmount'];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  amountBeforeTax!: number;
  taxAmount!: number;
  amountAfterTax!: number;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private appSharedService: AppSharedService,
    private navigationService: NavigationService,
  ) {
      this.navigationService.isSidenavOpened = false;
      this.navigationService.setFocus('purchases');
      this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      poNo: [{ value: this.appSharedService.genUniqueId(), disabled: true }],
      party: ['', Validators.required],
      poDate: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      invoiceDate: ['', Validators.required],
    });
  }

  submitOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured in invoice details!', NotifyType.ERROR);
      return;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify('Please add the receive order details!', NotifyType.ERROR);
      return;
    }
  }

  addData(): void {
    const dialogRef = this.dialog.open(ReceiveOrderDetailsComponent, { data: this.dataSource.length });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.push(result as never);
        this.calculateSummary();
        this.table.renderRows();
      }
    });
  }

  calculateSummary() {
    this.amountBeforeTax = 0;
    this.taxAmount = 0;
    this.amountAfterTax = 0;
    this.dataSource.forEach((order: any) => {
      this.amountBeforeTax += order.amount;
      this.taxAmount += (order.amount * order.gst)/100;
      this.amountAfterTax += order.totalAmount;
    })
  }

  updateData() {
    const selectedRow = this.selection.selected;
    if (selectedRow && selectedRow?.length === 1) {
      this.selection.deselect(selectedRow[0]);
      const dialogRef = this.dialog.open(ReceiveOrderDetailsComponent, { data: selectedRow[0] });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource.forEach((data: any, index: number) => {
              if (data?.orderNo === result?.orderNo) {
                this.dataSource[index] = result as never;
              }
            });
        }
        this.calculateSummary();
        this.table.renderRows();
      });
    } else {
      this.notificationService.notify('Please select one row to update', NotifyType.WARN);
    }
  }


  removeData() {
    const selectedRow = this.selection.selected;
    if (selectedRow && selectedRow?.length) {
      if (selectedRow.length === this.dataSource.length) {
        this.dataSource = [];
        this.selection.clear();
      } else {
        const newList: any = [];
        this.dataSource.forEach((data: any) => selectedRow.forEach(
          (row) => {
            if (data?.orderNo != row?.orderNo) {
              newList.push(data);
            } else {
              this.selection.deselect(row);
            }
          }
        ));
        this.dataSource = newList;
      }
      this.calculateSummary();
      this.table.renderRows();
    } else {
      this.notificationService.notify('Please select atleast one row to remove', NotifyType.WARN);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
