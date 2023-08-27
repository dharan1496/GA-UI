import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ReceiveConversionDetailsComponent } from './receive-conversion-details/receive-conversion-details.component';
import { ReceiveFibrePODts } from 'src/app/models/receiveFibrePODts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fibre-receive-conversion-order',
  templateUrl: './fibre-receive-conversion-order.component.html',
  styleUrls: ['./fibre-receive-conversion-order.component.scss'],
})
export class FibreReceiveConversionOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'fibreType',
    'shade',
    'receivedQty',
    'receivedBales',
    'lot',
    'hsnCode',
    'rate',
    'amount',
    'gstpercent',
    'totalAmount',
    'button',
  ];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.getFibreList();

    this.form = this.formBuilder.group({
      partyId: ['', Validators.required],
      recdDate: ['', Validators.required],
      recdDCNo: ['', Validators.required],
      dcDate: ['', Validators.required],
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

  getFibreList() {
    this.subscription.add(
      this.fibreService.getFibres().subscribe({
        next: (data) => (this.fibreService.fibres = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  submitOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in order details!',
        NotifyType.ERROR
      );
      return;
    }

    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add the receive order details!',
        NotifyType.ERROR
      );
      return;
    }

    const request = {
      ...this.form.value,
      receivedByUserId: 0,
      fibrePODts: [],
      recdDate: this.datePipe.transform(this.form.value.recdDate, 'dd/MM/yyyy'),
      dcDate: this.datePipe.transform(this.form.value.dcDate, 'dd/MM/yyyy'),
    };

    this.dataSource.forEach((data: any) => {
      request.fibrePODts.push({
        lot: data?.lot,
        hsnCode: data?.hsnCode,
        receivedWeight: data?.receivedQty,
        receivedBales: data?.receivedBales,
        rate: data?.rate,
        gstPercent: data?.gstpercent,
        fiberShadeId: data?.shadeId,
        fiberTypeId: data?.fibreTypeId,
      } as ReceiveFibrePODts);
    });
    this.subscription.add(
      this.fibreService.submitReceiveFibre(request).subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        error: (error) => {
          this.notificationService.error(error.message);
        },
      })
    );
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
  }

  addData(): void {
    const dialogRef = this.dialog.open(ReceiveConversionDetailsComponent, {
      data: this.dataSource.length,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.push(result as never);
        this.table.renderRows();
      }
    });
  }

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(ReceiveConversionDetailsComponent, {
      data: selectedRow,
    });
    dialogRef.afterClosed().subscribe((result) => {
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
