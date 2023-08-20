import { Component, ViewChild } from '@angular/core';
import { ChooseOrderForInvoiceComponent } from './choose-order-for-invoice/choose-order-for-invoice.component';
import { OrdersPendingInvoice } from 'src/app/models/ordersPendingInvoice';
import { MatDialog } from '@angular/material/dialog';
import { YarnService } from 'src/app/services/yarn.service';
import { DCsPendingInvoice } from 'src/app/models/dcsPendingInvoice';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormControl, Validators } from '@angular/forms';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { DatePipe } from '@angular/common';
import { CreateYarnInvoice } from 'src/app/models/createYarnInvoice';
import { YarnInvoice } from 'src/app/models/yarnInvoice';
import { SelectDcComponent } from './select-dc/select-dc.component';
import { MatTable } from '@angular/material/table';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';

interface chooseOrder {
  selected: OrdersPendingInvoice;
  partyId: number;
}

@Component({
  selector: 'app-delivery-invoice',
  templateUrl: './delivery-invoice.component.html',
  styleUrls: ['./delivery-invoice.component.scss'],
})
export class DeliveryInvoiceComponent {
  orderSelected!: OrdersPendingInvoice | undefined;
  dcDetails: DCsPendingInvoice[] = [];
  invoiceDate = new FormControl('', Validators.required);
  displayedColumns = [
    'dcNo',
    'dcDate',
    'shade',
    'blend',
    'counts',
    'deliveredQuantity',
    'rate',
    'amount',
    'gstPercent',
    'totalAmount',
    'vehicleNo',
    'remarks',
    'action',
  ];
  partyId!: number;
  invoiceDetails!: YarnInvoice;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private dialog: MatDialog,
    private yarnService: YarnService,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private datePipe: DatePipe
  ) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }

  chooseOrder() {
    this.dialog
      .open(ChooseOrderForInvoiceComponent, { minWidth: '75vw' })
      .afterClosed()
      .subscribe((order: chooseOrder) => {
        if (order) {
          this.orderSelected = order.selected;
          this.partyId = order.partyId;
        }
      });
  }

  submit() {
    if (!this.hasError()) {
      const createYarnInvoiceDts = this.dcDetails.map((dc) => ({
        dcId: dc.dcId,
        orderDtsId: dc.orderDtsId,
        rate: dc.rate,
        gstPercent: dc.gstPercent,
      }));
      const createYarnInvoice: CreateYarnInvoice = {
        invoiceDate:
          this.datePipe.transform(this.invoiceDate.value, 'dd/MM/yyyy') || '',
        createYarnInvoiceDts,
        createdByUserId: 0,
        partyId: this.partyId,
      };

      this.yarnService.createYarnOrderInvoice(createYarnInvoice).subscribe({
        next: (response) => {
          this.invoiceDetails = response;
          this.notificationService.success(
            {
              printInvoice: true,
              invoiceDetails: response,
              message: `${response.invoiceNo} - Invoice submitted successfully`,
            },
            true
          );
          this.resetData();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
    }
  }

  yarnDC() {
    this.dialog
      .open(SelectDcComponent, {
        minWidth: '75vw',
        data: this.orderSelected?.orderId,
      })
      .afterClosed()
      .subscribe((dcs) => {
        if (dcs) {
          this.dcDetails = dcs;
          this.table.renderRows();
        }
      });
  }

  removeDc(element: DCsPendingInvoice) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.dcDetails = this.dcDetails.filter((data) => data !== element);
        }
      });
  }

  hasError() {
    if (!this.orderSelected) {
      this.notificationService.notify(
        'Please choose the Order to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.invoiceDate.invalid) {
      this.invoiceDate.markAsTouched();
      this.notificationService.notify(
        'Please select Invoice date to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.invoiceDate.reset();
    this.dcDetails = [];
    this.orderSelected = undefined;
  }

  getTotalAmount(dc: DCsPendingInvoice) {
    const amount = (dc.deliveredQuantity || 0) * (dc.rate || 0);
    const tax = (amount * (dc.gstPercent || 0)) / 100;
    return amount + tax;
  }

  getSumOfAmount() {
    return this.dcDetails
      .map(
        (data: DCsPendingInvoice) =>
          (data.deliveredQuantity || 0) * (data?.rate || 0)
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getSumOfTax() {
    return this.dcDetails
      .map(
        (data: DCsPendingInvoice) =>
          ((data.deliveredQuantity || 0) *
            (data.rate || 0) *
            (data.gstPercent || 0)) /
          100
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getSumOfTotalAmount() {
    return this.dcDetails
      .map((data: DCsPendingInvoice) => this.getTotalAmount(data))
      .reduce((acc, value) => acc + value, 0);
  }
}
