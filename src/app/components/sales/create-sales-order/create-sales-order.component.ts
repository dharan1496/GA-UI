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
  poNo = '';

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private yarnService: YarnService
  ) {
    this.navigationService.setFocus(Constants.SALES);
    this.navigationService.menu = SALES;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.form = this.formBuilder.group({
      orderNo: '',
      partyId: ['', Validators.required],
      brokerName: ['', Validators.required],
      orderDate: ['', Validators.required],
      dueDays: ['', Validators.required],
      remarks: '',
    });
    this.getOrderNo();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOrderNo() {
    this.subscription.add(
      this.yarnService.getYarnOrderNo().subscribe({
        next: (data) => this.form.get('orderNo')?.setValue(data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
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
      //
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
    this.getOrderNo();
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
