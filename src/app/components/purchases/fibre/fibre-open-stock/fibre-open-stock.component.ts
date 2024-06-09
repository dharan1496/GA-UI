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
import { ReceiveFibrePODts } from 'src/app/models/receiveFibrePODts';
import { DatePipe } from '@angular/common';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';

@Component({
  selector: 'app-fibre-open-stock',
  templateUrl: './fibre-open-stock.component.html',
  styleUrls: ['./fibre-open-stock.component.scss'],
})
export class FibreOpenStockComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'fibreType',
    'shade',
    'receivedQty',
    'receivedBales',
    'lot',
    'hsnCode',
    'button',
  ];
  dataSource = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();
  maxDate = new Date();
  dcMaxDate = new Date();

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

    this.form.get('recdDate')?.valueChanges.subscribe((value) => {
      this.dcMaxDate = new Date(value);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPartyList() {
    this.subscription.add(
      this.partyService.getFibreParties().subscribe({
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
      receivedDCId: 0,
      ...this.form.value,
      partyName: this.getPartyName(),
      poNo: '',
      receivedByUserId: this.appSharedService.userId,
      fibrePODts: [],
      recdDate: this.datePipe.transform(this.form.value.recdDate, 'dd/MM/yyyy'),
      dcDate: this.datePipe.transform(this.form.value.dcDate, 'dd/MM/yyyy'),
    };

    this.dataSource.forEach((data: any) => {
      request.fibrePODts.push({
        receivedDCId: data?.receivedDCId || 0,
        receivedDtsId: data?.receivedDtsId || 0,
        poDtsId: data?.poDtsId,
        poNo: '',
        poDate: '',
        lot: data?.lot,
        hsnCode: data?.hsnCode,
        rate: 0,
        gstPercent: 0,
        receivedWeight: data?.receivedQty,
        receivedBales: data?.receivedBales,
        fiberShadeId: data?.shadeId,
        fiberShadeName: data?.shadeName,
        fiberTypeId: data?.fibreTypeId,
        fiberTypeName: data?.fibreType,
      } as ReceiveFibrePODts);
    });

    /* DEVNOTE: Need to add */

    // this.subscription.add(
    //   this.fibreService.submitReceiveFibre(request).subscribe({
    //     next: (response) => {
    //       this.notificationService.success(response);
    //       this.resetData();
    //     },
    //     error: (error) => {
    //       this.notificationService.error(error.message);
    //     },
    //   })
    // );
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
  }

  getPartyName() {
    const partyId = this.form.get('partyId')?.value;
    return this.partyService.parties.find((data) => data.partyId === partyId)
      ?.partyName;
  }

  addData(): void {
    const dialogRef = this.dialog.open(ReceiveStockComponent, {
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
    const dialogRef = this.dialog.open(ReceiveStockComponent, {
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
