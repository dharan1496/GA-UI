import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NavigationService } from 'src/app/navigation/navigation.service';
import { NotificationService } from 'src/app/notification-snackbar/notification.service';
import { PURCHASE } from 'src/constants/purchase-menu-values.const';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';


@Component({
  selector: 'app-fibre-purchase-order',
  templateUrl: './fibre-purchase-order.component.html',
  styleUrls: ['./fibre-purchase-order.component.scss']
})
export class FibrePurchaseOrderComponent implements OnInit {
  form!: FormGroup;
  displayedColumns: string[] = ['select', 'fibre', 'kgs', 'bales', 'rate', 'amount', 'gst', 'totalAmount'];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  orderDetails!: any[];
  amountBeforeTax!: any;
  taxAmount!: any;
  amountAfterTax!: any;

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
    });
  }

  submitOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured in party details!', NotifyType.ERROR);
      return;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify('Please add the order details!', NotifyType.ERROR);
      return;
    }
  }

  addData(): void {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, { data: this.dataSource.length });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderDetails.push(result);
        this.calculateSummary();
        this.dataSource.push(result as never);
        this.table.renderRows();
      }
    });
  }

  calculateSummary() {
    this.orderDetails.forEach(order => {
      this.amountBeforeTax += order?.amount;
      this.taxAmount += (order?.amount * order?.gst)/100;
      this.amountAfterTax += order?.amount - ((order?.amount * order?.gst)/100);
    })
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
      this.table.renderRows();
    } else {
      this.notificationService.notify('Please select atleast one row to remove', NotifyType.ERROR);
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
