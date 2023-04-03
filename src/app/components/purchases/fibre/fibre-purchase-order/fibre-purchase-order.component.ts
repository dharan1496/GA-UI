import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { PrintFibrePOService } from './print-fibre-po/print.fibre-po.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { PartyService } from 'src/app/services/party.service';
import { Subscription } from 'rxjs';
import { FibreService } from 'src/app/services/fibre.service';
import { FibrePODto } from 'src/app/models/fibrePODto';
import { FibrePODtsDto } from 'src/app/models/fibrePODtsDto';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { DatePipe } from '@angular/common';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-fibre-purchase-order',
  templateUrl: './fibre-purchase-order.component.html',
  styleUrls: ['./fibre-purchase-order.component.scss']
})
export class FibrePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = ['fibreName', 'shadeName', 'weight', 'rate', 'amount', 'gstpercent', 'totalAmount', 'button'];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  selection = new SelectionModel<any>(true, []);
  amountBeforeTax!: number;
  taxAmount!: number;
  amountAfterTax!: number;
  orderDetails!: any;
  subscription = new Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private printFibrePOService: PrintFibrePOService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private datePipe: DatePipe,
  ) {
    this.navigationService.isSidenavOpened = false;
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.subscription.add(this.partyService.getParties().subscribe((data) => this.partyService.parties = data));
    this.subscription.add(this.fibreService.getFibres().subscribe((data) => this.fibreService.fibres = data));

    this.form = this.formBuilder.group({
      fibrePoid: 0,
      pono: [{ value: this.appSharedService.generatePONo(), disabled: true }],
      partyId: ['', Validators.required],
      podate: ['', Validators.required],
      createdBy: this.appSharedService.username,
      fibrePODts: '',
    });

    window.onafterprint = () => {
      this.printFibrePOService.print = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitOrder() {
    if (!this.hasError()) {
       // Need to make API call here to submit data
      this.orderDetails = {
        ...this.form.getRawValue(),
        podate: this.datePipe.transform(this.form.get('podate')?.value, 'dd/MM/yyyy'),
        orders: [...this.dataSource],
        amountBeforeTax: this.amountBeforeTax,
        taxAmount: this.taxAmount,
        amountAfterTax: this.amountAfterTax,
      }
      this.resetData();
      this.printFibrePOService.fibrePOData = this.orderDetails;
      this.notificationService.success({
        printPO: true,
        message: 'Purchase order submitted successfully',
      }, true);
    }
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
    this.form.patchValue({ pono: this.appSharedService.generatePONo() });
  }

  addData(): void {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, { data: this.dataSource.length });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.push(result as never);
        this.calculateSummary();
        this.table.renderRows();
        const fibrePORequest = this.form.getRawValue() as FibrePODto;
        fibrePORequest.fibrePODts = this.dataSource as FibrePODtsDto[];
      }
    });
  }

  calculateSummary() {
    this.amountBeforeTax = 0;
    this.taxAmount = 0;
    this.amountAfterTax = 0;
    this.dataSource.forEach((order: any) => {
      this.amountBeforeTax += order.amount;
      this.taxAmount += (order.amount * order.gstpercent)/100;
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
    return this.dataSource.map((data: any) => (data?.amount * data?.gstpercent)/100).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.dataSource.map((data: any) => data?.totalAmount).reduce((acc, value) => acc + value, 0);
  }
}
