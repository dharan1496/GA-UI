import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/notification-snackbar/notification.service';
import { PURCHASE } from 'src/constants/purchase-menu-values.const';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { PrintFibrePOService } from './print-fibre-po/print.fibre-po.service';
import { UserActionConfirmationComponent } from 'src/app/user-action-confirmation/user-action-confirmation.component';
import { NavigationService } from 'src/app/shared/navigation.service';


@Component({
  selector: 'app-fibre-purchase-order',
  templateUrl: './fibre-purchase-order.component.html',
  styleUrls: ['./fibre-purchase-order.component.scss']
})
export class FibrePurchaseOrderComponent implements OnInit {
  form!: FormGroup;
  displayedColumns: string[] = ['fibre', 'shadeName', 'kgs', 'rate', 'amount', 'gst', 'totalAmount', 'button'];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  amountBeforeTax!: number;
  taxAmount!: number;
  amountAfterTax!: number;
  successBanner = false;
  orderDetails!: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private printFibrePOService: PrintFibrePOService
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

    window.onafterprint = () => {
      this.printFibrePOService.print = false;
      this.successBanner = false;
    }
  }

  submitOrder() {
    if (!this.hasError()) {
       // Need to make API call here to submit data
      this.orderDetails = {
        ...this.form.getRawValue(),
        orders: [...this.dataSource],
        amountBeforeTax: this.amountBeforeTax,
        taxAmount: this.taxAmount,
        amountAfterTax: this.amountAfterTax,
      }
      this.successBanner = true;
      this.resetData();
    }
   
  }

  printBill() {
    this.printFibrePOService.fibrePOData = this.orderDetails;
    this.printFibrePOService.print = true;
    setTimeout(() => window.print());
  }

  hasError() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured in party details!', NotifyType.ERROR);
      return true;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify('Please add the order details!', NotifyType.ERROR);
      return true;
    }
    return false;
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
    this.form.patchValue({ poNo: this.appSharedService.genUniqueId() });
  }

  addData(): void {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, { data: this.dataSource.length });

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

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, { data: selectedRow });
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
  }

  removeData(selectedRow: any) {
    this.dialog.open(UserActionConfirmationComponent).afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          const newList: any = [];
          this.dataSource.forEach((data: any) =>{
            if (data?.orderNo != selectedRow?.orderNo) {
              newList.push(data);
            }
          });
          this.dataSource = newList;
          this.calculateSummary();
          this.table.renderRows();
        }
      }
    );
  }

  getAmount() {
    return this.dataSource.map((data: any) => data?.amount).reduce((acc, value) => acc + value, 0);
  }

  getTaxAmount() {
    return this.dataSource.map((data: any) => (data?.amount * data?.gst)/100).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.dataSource.map((data: any) => data?.totalAmount).reduce((acc, value) => acc + value, 0);
  }

  closeSuccessBanner() {
    this.successBanner = false;
  }
}
