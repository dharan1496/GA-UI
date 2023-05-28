import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { SalesOrderDialogComponent } from './sales-order-dialog/sales-order-dialog.component';
import { YarnService } from 'src/app/services/yarn.service';
import { YarnOrder } from 'src/app/models/yarnOrder';
import { YarnOrderDetails } from 'src/app/models/yarnOrderDetails';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-sales-order',
  templateUrl: './create-sales-order.component.html',
  styleUrls: ['./create-sales-order.component.scss'],
})
export class CreateSalesOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'counts',
    'blend',
    'shade',
    'weight',
    'rate',
    'amount',
    'gstPercent',
    'totalAmount',
    'button',
  ];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();
  updateOrderDetails!: YarnOrder;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private yarnService: YarnService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.SALES);
    this.navigationService.menu = SALES;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.form = this.formBuilder.group({
      orderNo: ['', Validators.required],
      partyId: ['', Validators.required],
      brokerName: ['', Validators.required],
      orderDate: ['', Validators.required],
      receivedDate: ['', Validators.required],
      dueDays: ['', Validators.required],
      remarks: '',
    });
    this.router.url.includes('update-order') && this.checkForUpdate();
  }

  checkForUpdate() {
    const orderDetails = sessionStorage.getItem('order');
    if (orderDetails) {
      this.updateOrderDetails = JSON.parse(orderDetails);
      this.form.patchValue(this.updateOrderDetails);
      this.dataSource = this.updateOrderDetails.orderDts as never[];
      sessionStorage.clear();
    } else {
      this.router.navigateByUrl('sales/new-order');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPartyList() {
    this.subscription.add(
      this.partyService.getParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  submitOrder() {
    if (!this.hasError()) {
      const orderDts: YarnOrderDetails[] = this.dataSource.map((data: any) => ({
        ordetDetailId: 0,
        countsId: data.countsId,
        counts: data.countsName,
        blendId: data.blendId,
        blendName: data.blendName,
        shadeId: data.shadeId,
        shadeName: data.shadeName,
        orderQuantity: data.orderQuantity,
        rate: data.rate,
        gstPercent: data.gstPercent,
      }));
      const yarnOrder: YarnOrder = {
        ...this.form.value,
        orderDate: this.datePipe.transform(
          this.form.value?.orderDate,
          'dd/MM/yyyy'
        ),
        receivedDate: this.datePipe.transform(
          this.form.value?.receivedDate,
          'dd/MM/yyyy'
        ),
        orderId: 0,
        receivedByUserId: 0,
        orderDts,
      };
      this.yarnService.receiveYarnOrder(yarnOrder).subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      });
    }
  }

  hasError() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in Sales details!',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add the order details!',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
  }

  addData(): void {
    this.dialog
      .open(SalesOrderDialogComponent, {
        data: this.dataSource.length,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.push(result as never);
          this.table.renderRows();
        }
      });
  }

  updateData(selectedRow: any) {
    this.dialog
      .open(SalesOrderDialogComponent, {
        data: selectedRow,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource.forEach((data: any, index: number) => {
            if (data?.orderNo === result?.orderNo) {
              this.dataSource[index] = result as never;
            }
          });
        }
        this.table.renderRows();
      });
  }

  removeData(selectedRow: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const newList: any = [];
          this.dataSource.forEach((data: any) => {
            if (data != selectedRow) {
              newList.push(data);
            }
          });
          this.dataSource = newList;
          this.table.renderRows();
        }
      });
  }

  getAmount() {
    return this.dataSource
      .map((data: any) => data?.amount)
      .reduce((acc, value) => acc + value, 0);
  }

  getTaxAmount() {
    return this.dataSource
      .map((data: any) => (data?.amount * data?.gstPercent) / 100)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.dataSource
      .map((data: any) => data?.totalAmount)
      .reduce((acc, value) => acc + value, 0);
  }
}
