import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/app-shared.service';
import { ErrorService } from 'src/app/error-snackbar/error.service';
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
  orderDetails!: any;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private errorService: ErrorService, private appSharedService: AppSharedService) {}

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
      this.errorService.showError('Error occured in invoice details!');
      return;
    }
    if (!this.dataSource.length) {
      this.errorService.showError('Please add the receive order details!');
      return;
    }
  }

  addData(): void {
    const dialogRef = this.dialog.open(ReceiveOrderDetailsComponent, { data: this.dataSource.length });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderDetails = result;
        this.dataSource.push(result as never);
        this.table.renderRows();
      }
    });
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
      this.errorService.showError('Please select atleast one row to remove');
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
