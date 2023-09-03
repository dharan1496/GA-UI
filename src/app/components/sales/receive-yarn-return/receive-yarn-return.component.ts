import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { YarnOrder } from 'src/app/models/yarnOrder';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { ChooseDeliveryForReturnComponent } from './choose-delivery-for-return/choose-delivery-for-return.component';
import { YarnDeliverySearchResult } from 'src/app/models/yarnDeliverySearchResult';
import { YarnReturn } from 'src/app/models/yarnReturn';

@Component({
  selector: 'app-receive-yarn-return',
  templateUrl: './receive-yarn-return.component.html',
  styleUrls: ['./receive-yarn-return.component.scss'],
})
export class ReceiveYarnReturnComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'issuedDCNo',
    'dcDate',
    'counts',
    'blend',
    'shade',
    'lot',
    'issuedQty',
    'returnQty',
    'button',
  ];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();
  updateOrderDetails!: YarnOrder;
  countsList: YarnCounts[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private yarnService: YarnService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.SALES);
    this.navigationService.menu = SALES;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.form = this.formBuilder.group({
      partyNo: '',
      returnDate: [new Date(), Validators.required],
      returnDCNo: ['', Validators.required],
      returnReason: '',
      remarks: '',
    });
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

  chooseDelivery() {
    this.dialog
      .open(ChooseDeliveryForReturnComponent, { minWidth: '75vw' })
      .afterClosed()
      .subscribe((details: YarnDeliverySearchResult[]) => {
        if (details) {
          this.dataSource = details as any;
        }
      });
  }

  submitOrder() {
    if (!this.hasError()) {
      const yarnReturnDetails = this.dataSource.map((data) => ({
        returnDtsId: 0,
        issuedDCId: data['dcId'],
        issuedDCNo: data['dcNo'],
        countsId: data['countsId'],
        counts: data['counts'],
        blendId: data['blendId'],
        blendName: data['blendName'],
        shadeId: data['shadeId'],
        shadeName: data['shadeName'],
        lot: data['lot'],
        issuedQty: data['deliveredQuantity'],
        returnQty: data['returnQty'],
      }));
      const yarnReturn: YarnReturn = {
        ...this.form.value,
        returnDate: this.datePipe.transform(
          this.form.value?.returnDate,
          'dd/MM/yyyy'
        ),
        partyNo: this.dataSource[0]['partyId'],
        yarnReturnDetails,
      };
      this.yarnService.receiveYarnReturn(yarnReturn).subscribe({
        next: (response) => {
          this.resetData();
          this.notificationService.success('Return submitted successfully');
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
        'Error occured in Return details!',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add the Return details!',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.dataSource.every((data) => data['returnQty'])) {
      this.notificationService.notify(
        'Please enter the Return Quantity',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.form.reset({ returnDate: new Date() });
    this.dataSource = [];
    this.table.renderRows();
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

  checkZeroReturnQty(element: any) {
    return element.returnQty == 0;
  }

  greaterThanIssuedQty(element: any) {
    return element.returnQty > element.deliveredQuantity;
  }
}
