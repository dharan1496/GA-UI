import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/components/notification-snackbar/notification.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { ReceiveOrderDetailsComponent } from './receive-order-details/receive-order-details.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Subscription } from 'rxjs';
import { PartyService } from 'src/app/services/party.service';
import { FibreService } from 'src/app/services/fibre.service';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';

@Component({
  selector: 'app-fibre-receive-purchase-order',
  templateUrl: './fibre-receive-purchase-order.component.html',
  styleUrls: ['./fibre-receive-purchase-order.component.scss']
})
export class FibreReceivePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = ['fibreName', 'hsnCode', 'orderQty', 'pendingQty', 'receivedQty', 'receivedBales', 'lot', 'rate', 'amount', 'gst', 'totalAmount', 'button'];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  amountBeforeTax!: number;
  taxAmount!: number;
  amountAfterTax!: number;
  successBanner = false;
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
  ) {
      this.navigationService.isSidenavOpened = false;
      this.navigationService.setFocus('purchases');
      this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.subscription.add(this.partyService.getParties().subscribe((data) => this.partyService.parties = data));
    this.subscription.add(this.fibreService.getFibres().subscribe((data) => this.fibreService.fibres = data));

    this.form = this.formBuilder.group({
      poNo: [{ value: this.appSharedService.genUniqueId(), disabled: true }],
      party: ['', Validators.required],
      poDate: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      invoiceDate: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.successBanner = true;
    this.resetData();
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
    this.form.patchValue({ poNo: this.appSharedService.genUniqueId() });
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

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(ReceiveOrderDetailsComponent, { data: selectedRow });
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
