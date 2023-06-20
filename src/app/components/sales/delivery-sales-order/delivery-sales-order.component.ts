import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { ChooseOrderForDeliveryComponent } from './choose-order-for-delivery/choose-order-for-delivery.component';
import { OrdersPendingDelivery } from 'src/app/models/ordersPendingDelivery';
import { SelectYarnStockComponent } from './select-yarn-stock/select-yarn-stock.component';
import { YarnDeliveryDts } from 'src/app/models/yarnDelivertDts';
import { YarnStockByOrderId } from 'src/app/models/yarnStockByOrderId';
import { YarnDelivery } from 'src/app/models/yarnDelivery';
import { DatePipe } from '@angular/common';
import { PartyService } from 'src/app/services/party.service';
import { Party } from 'src/app/models/party';

@Component({
  selector: 'app-deliver-sales-order',
  templateUrl: './delivery-sales-order.component.html',
  styleUrls: ['./delivery-sales-order.component.scss'],
})
export class DeliverySalesOrderComponent implements OnInit {
  orderSelected!: OrdersPendingDelivery | undefined;
  stockDetails = [];
  parties: Party[] = [];
  stockDisplayedColumns = [
    'programNo',
    'counts',
    'shade',
    'blend',
    'lot',
    'productionQuantity',
    'stockQuantity',
    'issueQuantity',
    'rate',
    'amount',
    'gstpercent',
    'totalAmount',
    'action',
  ];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();
  form!: FormGroup;

  constructor(
    private navigationService: NavigationService,
    public yarnService: YarnService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private partyService: PartyService
  ) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      vehicleNo: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      deliveryAddressId: ['', Validators.required],
      remarks: '',
    });
  }

  getPartiesForAddress() {
    this.partyService.getParties().subscribe({
      next: (parties) => (this.parties = parties),
      error: (error) =>
        this.notificationService.error(
          typeof error?.error === 'string' ? error?.error : error?.message
        ),
    });
  }

  chooseOrder() {
    this.dialog
      .open(ChooseOrderForDeliveryComponent, { minWidth: 1000 })
      .afterClosed()
      .subscribe((order: OrdersPendingDelivery) => {
        if (order) {
          this.stockDetails = [];
          this.orderSelected = order;
          this.getPartiesForAddress();
          this.form
            .get('deliveryAddressId')
            ?.setValue(this.orderSelected.partyId);
        }
      });
  }

  yarnStock() {
    this.dialog
      .open(SelectYarnStockComponent, {
        minWidth: 1000,
        data: this.orderSelected?.orderId,
      })
      .afterClosed()
      .subscribe((stock) => {
        if (stock) {
          this.stockDetails = stock;
          this.table.renderRows();
        }
      });
  }

  submit() {
    if (!this.hasError()) {
      const deliveryDts: YarnDeliveryDts[] = this.stockDetails.map(
        (stock: YarnStockByOrderId) => ({
          deliveryDtsId: 0,
          orderDtsId: this.orderSelected?.orderDtsId || 0,
          shadeId: stock.shadeId,
          blendId: stock.blendId,
          countsId: stock.countsId,
          productionDtsId: stock.productionYarnDtsId,
          deliveryQuantity: +stock.issueQuantity,
        })
      );
      const deliveryRequest: YarnDelivery = {
        ...this.form.value,
        dcNo: '',
        deliveryDate:
          this.datePipe.transform(
            this.form.get('deliveryDate')?.value,
            'dd/MM/yyyy'
          ) || '',
        orderId: this.orderSelected?.orderId,
        deliveryPartyId: this.orderSelected?.partyId,
        createdByUserId: 0,
        deliveryDts,
      };

      this.yarnService.createYarnDelivery(deliveryRequest).subscribe({
        next: (response) => {
          this.resetData();
          this.notificationService.success(
            {
              printDC: true,
              dcId: response.dcId,
              message: `${response.dcNo} - Delivery submitted successfully`,
            },
            true
          );
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      });
    }
  }

  hasError(): boolean {
    if (!this.orderSelected) {
      this.notificationService.notify(
        'Please choose the Order to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please enter delivery details to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.stockDetails.length === 0) {
      this.notificationService.notify(
        'Please choose the Stock to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.stockDetails.every((data) => data['issueQuantity'])) {
      this.notificationService.notify(
        'Please enter the IssueQty',
        NotifyType.ERROR
      );
      return true;
    }
    if (document.getElementsByClassName('issue-qty-border-error').length > 0) {
      this.notificationService.notify(
        'Please correct the IssueQty to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.orderSelected = undefined;
    this.stockDetails = [];
    this.form.reset();
  }

  removeStock(element: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.stockDetails = this.stockDetails.filter(
            (data) => data !== element
          );
        }
      });
  }

  getTotalAmount(issueQuantity: number) {
    const amount = (issueQuantity || 0) * (this.orderSelected?.rate || 0);
    const tax = (amount * (this.orderSelected?.gstPercent || 0)) / 100;
    return amount + tax;
  }

  getSumOfAmount() {
    return this.stockDetails
      .map(
        (data: any) =>
          (data?.issueQuantity || 0) * (this.orderSelected?.rate || 0)
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getSumOfTax() {
    return this.stockDetails
      .map(
        (data: any) =>
          ((data?.issueQuantity || 0) *
            (this.orderSelected?.rate || 0) *
            (this.orderSelected?.gstPercent || 0)) /
          100
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getSumOfTotalAmount() {
    return this.stockDetails
      .map((data: any) => this.getTotalAmount(data?.issueQuantity))
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalIssueQty(): number {
    return this.stockDetails.reduce(
      (acc, curr) => acc + (+curr['issueQuantity'] || 0),
      0
    );
  }

  checkIssueQty(element: any): boolean {
    return element.issueQuantity > element.stockQuantity;
  }

  checkZeroInIssueQty(element: any): boolean {
    return element.issueQuantity == 0;
  }

  getAddress(party: Party) {
    return `${party.partyName}, ${party.branchName}, ${party.address1}, ${
      party.address2 ? party.address2 + ',' : ''
    } ${party.address3 ? party.address3 + ',' : ''} ${party.cityName}, ${
      party.stateName
    } - ${party.pinCode}`;
  }
}
