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
import { ReceiveFibrePO } from 'src/app/models/receiveFibrePO';
import { Router } from '@angular/router';

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
  updateReceivedCODetails?: ReceiveFibrePO;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private datePipe: DatePipe,
    private router: Router
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

    if (this.router.url.includes('update-received-conversion-order')) {
      this.checkForUpdate();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkForUpdate() {
    const poDetails = sessionStorage.getItem('receivedCODetails');
    if (poDetails) {
      this.updateReceivedCODetails = JSON.parse(poDetails);
      this.patchUpdateDetails();
      sessionStorage.clear();
    } else {
      this.router.navigateByUrl(
        '/purchases/fibre/update-received-conversion-order'
      );
    }
  }

  patchUpdateDetails() {
    this.form.get('partyId')?.setValue(this.updateReceivedCODetails?.partyId);
    this.form.get('partyId')?.disable();
    this.form.get('recdDCNo')?.setValue(this.updateReceivedCODetails?.recdDCNo);
    this.form.get('recdDCNo')?.disable();
    const recdDate = this.updateReceivedCODetails?.recdDate.split('/');
    if (recdDate) {
      this.form
        .get('recdDate')
        ?.setValue(
          new Date(`${recdDate[1]}/${recdDate[0]}/${recdDate[2]}`).toISOString()
        );
      this.form.get('recdDate')?.disable();
    }
    const dcDate = this.updateReceivedCODetails?.dcDate.split('/');
    if (dcDate) {
      this.form
        .get('dcDate')
        ?.setValue(
          new Date(`${dcDate[1]}/${dcDate[0]}/${dcDate[2]}`).toISOString()
        );
      this.form.get('dcDate')?.disable();
    }

    this.dataSource = this.updateReceivedCODetails?.fibrePODts?.map(
      (data, index) => {
        return {
          receivedDCId: data?.receivedDCId || 0,
          receivedDtsId: data?.receivedDtsId || 0,
          orderNo: index + 1,
          fibreType: data?.fiberTypeName,
          fibreTypeId: data?.fiberTypeId,
          shadeName: data?.fiberShadeName,
          shadeId: data?.fiberShadeId,
          orderQty: data?.orderQty,
          pendingQty: (data?.orderQty || 0) - data?.receivedWeight || 0,
          receivedQty: data?.receivedWeight,
          receivedBales: data?.receivedBales,
          lot: data?.lot,
          hsnCode: data?.hsnCode,
          rate: data?.rate,
          gstpercent: data?.gstPercent,
          amount: data?.rate * data?.receivedWeight,
          totalAmount:
            data?.rate * data?.receivedWeight +
            (data?.rate * data?.receivedWeight * data?.gstPercent) / 100,
          isValid: true,
          update: true,
        };
      }
    ) as never[];
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
      receivedDCId: this.updateReceivedCODetails
        ? this.updateReceivedCODetails?.receivedDCId
        : 0,
      ...this.form.value,
      partyName: this.getPartyName(),
      poNo: '',
      receivedByUserId: 0,
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
        receivedWeight: data?.receivedQty,
        receivedBales: data?.receivedBales,
        rate: data?.rate,
        gstPercent: data?.gstpercent,
        fiberShadeId: data?.shadeId,
        fiberShadeName: data?.shadeName,
        fiberTypeId: data?.fibreTypeId,
        fiberTypeName: data?.fibreType,
      } as ReceiveFibrePODts);
    });

    if (this.updateReceivedCODetails) {
      this.subscription.add(
        this.fibreService.UpdateReceiveFibre(request).subscribe({
          next: (response) => {
            if (response === 'true') {
              this.notificationService
                .success('Updated successfully!')
                .afterClosed()
                .subscribe(() =>
                  this.router.navigateByUrl(
                    '/purchases/fibre/search-received-po'
                  )
                );
            } else {
              this.notificationService.error('Unable to update the order!');
            }
          },
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
      );
    } else {
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
