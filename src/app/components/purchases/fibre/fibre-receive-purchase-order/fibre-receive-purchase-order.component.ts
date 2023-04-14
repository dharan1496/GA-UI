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

@Component({
  selector: 'app-fibre-receive-purchase-order',
  templateUrl: './fibre-receive-purchase-order.component.html',
  styleUrls: ['./fibre-receive-purchase-order.component.scss'],
})
export class FibreReceivePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'poNo',
    'fibreType',
    'shade',
    'orderQty',
    'pendingQty',
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

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private router: Router,
    public appSharedService: AppSharedService
  ) {
    this.navigationService.setFocus('purchases');
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.partyService
        .getParties()
        .subscribe((data) => (this.partyService.parties = data))
    );
    this.subscription.add(
      this.fibreService
        .getFibres()
        .subscribe((data) => (this.fibreService.fibres = data))
    );

    this.form = this.formBuilder.group({
      poNo: [{ value: '', disabled: true }],
      partyId: '',
      recdDate: ['', Validators.required],
      recdDCNo: ['', Validators.required],
      dcDate: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      ...this.form.value,
      receivedByUserId: 0,
      fibrePODts: [],
    };

    this.dataSource.forEach((data: any) => {
      request.fibrePODts.push({
        poDtsId: 0,
        lot: data?.lot,
        hsnCode: data?.hsnCode,
        receivedWeight: data?.receivedQty,
        receivedBales: data?.receivedBales,
        rate: data?.rate,
        gstPercent: data?.gstpercent,
      } as ReceiveFibrePODts);
    });

    this.subscription.add(
      this.fibreService.submitReceiveFibre(request).subscribe(
        (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        (error) => {
          this.notificationService.error(error.message);
        }
      )
    );
  }

  resetData() {
    this.form.reset();
    this.table.renderRows();
    this.dataSource = [];
  }

  goToSearch() {
    this.router.navigateByUrl('purchases/fibre');
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
            if (data?.orderNo != selectedRow?.orderNo) {
              newList.push(data);
            }
          });
          this.dataSource = newList;
          this.table.renderRows();
          const poNo = [
            ...new Set(this.dataSource.map((po: any) => po.poNo)),
          ].concat();
          this.form.patchValue({ poNo: poNo });
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
    });
    this.dataSource = po as never[];
  }

  getPartyName() {
    const partyId = this.form.get('partyId')?.value;
    return this.partyService.parties.find((data) => data.partyId === partyId)
      ?.partyName;
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
