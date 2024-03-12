import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { ReceiveOrderDetailsComponent } from './receive-order-details/receive-order-details.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Subscription } from 'rxjs';
import { PartyService } from 'src/app/services/party.service';
import { FibreService } from 'src/app/services/fibre.service';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Router } from '@angular/router';
import { PendingFibrePoComponent } from './pending-fibre-po/pending-fibre-po.component';
import { ReceiveFibrePODts } from 'src/app/models/receiveFibrePODts';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ReceiveFibrePO } from 'src/app/models/receiveFibrePO';

@Component({
  selector: 'app-fibre-receive-purchase-order',
  templateUrl: './fibre-receive-purchase-order.component.html',
  styleUrls: ['./fibre-receive-purchase-order.component.scss'],
})
export class FibreReceivePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'fibreType',
    'shade',
    'orderQty',
    'balanceQty',
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
  selection = new SelectionModel<any>(true, []);
  subscription = new Subscription();
  poDate!: Date;
  updateReceivedPODetails?: ReceiveFibrePO;
  clearSearch = true;
  maxDate = new Date();
  dcMaxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private router: Router,
    public appSharedService: AppSharedService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus('purchases');
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.getParty();
    this.getFibre();
    this.form = this.formBuilder.group({
      poNo: [{ value: '', disabled: true }],
      partyId: '',
      poDate: [{ value: '', disabled: true }],
      recdDate: ['', Validators.required],
      recdDCNo: ['', Validators.required],
      dcDate: ['', Validators.required],
    });

    this.form.get('recdDate')?.valueChanges.subscribe((value) => {
      this.dcMaxDate = new Date(value);
    });

    if (this.router.url.includes('update-received-purchase-order')) {
      this.checkForUpdate();
    }
  }

  ngOnDestroy() {
    this.clearSearch && sessionStorage.removeItem('search-received-fibre-po');
    this.subscription.unsubscribe();
  }

  checkForUpdate() {
    const poDetails = sessionStorage.getItem('receivedPODetails');
    if (poDetails) {
      this.updateReceivedPODetails = JSON.parse(poDetails);
      this.patchUpdateDetails();
      sessionStorage.removeItem('receivedPODetails');
    } else {
      this.router.navigateByUrl('/purchases/fibre/receive-po-fibre');
    }
  }

  patchUpdateDetails() {
    const poNo = [
      ...new Set(
        this.updateReceivedPODetails?.fibrePODts?.map((po: any) => po.poNo)
      ),
    ]
      ?.concat()
      .toString()
      ?.replaceAll(',', ', ');
    this.form.get('poNo')?.setValue(poNo);
    this.form.get('partyId')?.setValue(this.updateReceivedPODetails?.partyId);
    this.form.get('partyId')?.disable();
    this.form
      .get('poDate')
      ?.setValue(
        this.getPODate(this.updateReceivedPODetails?.fibrePODts as any)
      );
    this.form.get('recdDCNo')?.setValue(this.updateReceivedPODetails?.recdDCNo);
    this.form.get('recdDCNo')?.disable();
    const recdDate = this.updateReceivedPODetails?.recdDate.split('/');
    if (recdDate) {
      this.form
        .get('recdDate')
        ?.setValue(
          new Date(`${recdDate[1]}/${recdDate[0]}/${recdDate[2]}`).toISOString()
        );
      this.form.get('recdDate')?.disable();
    }
    const dcDate = this.updateReceivedPODetails?.dcDate.split('/');
    if (dcDate) {
      this.form
        .get('dcDate')
        ?.setValue(
          new Date(`${dcDate[1]}/${dcDate[0]}/${dcDate[2]}`).toISOString()
        );
      this.form.get('dcDate')?.disable();
    }

    this.dataSource = this.updateReceivedPODetails?.fibrePODts?.map(
      (data, index) => {
        return {
          receivedDCId: data?.receivedDCId || 0,
          receivedDtsId: data?.receivedDtsId || 0,
          orderNo: index + 1,
          poNo: data?.poNo,
          poDtsId: data?.poDtsId,
          fibreType: data?.fiberTypeName,
          fibreTypeId: data?.fiberTypeId,
          shadeName: data?.fiberShadeName,
          shadeId: data?.fiberShadeId,
          orderQty: data?.orderQty,
          balanceQty: (data?.orderQty || 0) - data?.receivedWeight || 0,
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

  getParty() {
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

  getFibre() {
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
    if (!this.form.get('poNo')?.value || !this.form.get('partyId')?.value) {
      this.notificationService.notify(
        'Please choose pending PO!',
        NotifyType.ERROR
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in invoice details!',
        NotifyType.ERROR
      );
      return;
    }

    const valid = this.dataSource.reduce(
      (acc: boolean, cur: any) => acc && cur?.isValid,
      true
    );

    if (!this.dataSource.length || !valid) {
      this.notificationService.notify(
        'Please add the receive order details!',
        NotifyType.ERROR
      );
      return;
    }

    const request = {
      receivedDCId: this.updateReceivedPODetails
        ? this.updateReceivedPODetails?.receivedDCId
        : 0,
      ...this.form.value,
      partyName: this.getPartyName(),
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
        poNo: data?.poNo,
        poDate: this.form.getRawValue()?.poDate,
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

    if (this.updateReceivedPODetails) {
      this.subscription.add(
        this.fibreService.UpdateReceiveFibre(request).subscribe({
          next: (response) => {
            if (response === 'true') {
              this.notificationService
                .success('Updated successfully!')
                .afterClosed()
                .subscribe(() => this.goToSearch());
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
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
      );
    }
  }

  resetData() {
    this.form.reset();
    this.table.renderRows();
    this.dataSource = [];
  }

  goToSearch() {
    this.clearSearch = false;
    this.router.navigateByUrl('purchases/fibre/search-received-po');
  }

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(ReceiveOrderDetailsComponent, {
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
          const poNo = [
            ...new Set(this.dataSource.map((po: any) => po.poNo)),
          ].concat();
          this.form.patchValue({ poNo: poNo });
          if (this.dataSource.length === 0) {
            this.form.get('poNo')?.reset();
            this.form.get('partyId')?.reset();
            this.form.get('poDate')?.reset();
          }
        }
      });
  }

  choosePending() {
    this.dialog
      .open(PendingFibrePoComponent, {
        width: '65%',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.patchData(data);
        }
      });
  }

  patchData(data: any) {
    const po = data?.po?.map((data: any, index: number) => {
      data['orderNo'] = index + 1;
      data['isValid'] = false;
      return data;
    });
    const poNo = [...new Set(po?.map((po: any) => po.poNo))]
      ?.concat()
      .toString()
      ?.replaceAll(',', ', ');

    this.form.reset();
    this.form.patchValue({
      poNo: poNo,
      partyId: data.partyId,
      poDate: this.getPODate(data?.po),
    });
    this.dataSource = po as never[];
  }

  getPartyName() {
    const partyId = this.form.get('partyId')?.value;
    return this.partyService.parties.find((data) => data.partyId === partyId)
      ?.partyName;
  }

  getPODate(details: any[]) {
    const dates = details.map((data) =>
      moment(data.poDate, 'DD/MM/YYYY').toDate()
    );
    this.poDate = dates.reduce((a, b) => (a > b ? a : b));
    return this.poDate;
  }

  getAmount() {
    return this.dataSource
      .map((data: any) => data?.amount || 0)
      .reduce((acc, value) => acc + value, 0);
  }

  getTaxAmount() {
    return this.dataSource
      .map((data: any) => ((data?.amount || 0) * data?.gstpercent) / 100)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.dataSource
      .map((data: any) => data?.totalAmount || 0)
      .reduce((acc, value) => acc + value, 0);
  }
}
