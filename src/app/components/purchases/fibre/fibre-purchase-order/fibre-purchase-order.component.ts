import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { PrintFibrePOService } from './print-fibre-po/print.fibre-po.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { PartyService } from 'src/app/services/party.service';
import { Subscription } from 'rxjs';
import { FibreService } from 'src/app/services/fibre.service';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Constants } from 'src/app/constants/constants';
import { Router } from '@angular/router';
import { CreateFibrePO } from 'src/app/models/createFibrePO';
import { CreateFibrePODts } from 'src/app/models/createFibrePODts';

@Component({
  selector: 'app-fibre-purchase-order',
  templateUrl: './fibre-purchase-order.component.html',
  styleUrls: ['./fibre-purchase-order.component.scss'],
})
export class FibrePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'fibreName',
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
    private printFibrePOService: PrintFibrePOService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.getPoNo();
    this.getPartyList();
    this.getFibreList();

    this.form = this.formBuilder.group({
      poNo: [{ value: '', disabled: true }],
      partyId: ['', Validators.required],
      pOdate: ['', Validators.required],
    });

    window.onafterprint = () => {
      this.printFibrePOService.print = false;
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPoNo() {
    this.subscription.add(
      this.fibreService.getPONo().subscribe({
        next: (data) => this.form.get('poNo')?.setValue(data),
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
    if (!this.hasError()) {
      const fibrePODts = this.dataSource.map((data: CreateFibrePODts) => {
        return {
          fibreTypeId: data.fibreTypeId,
          shadeId: data.shadeId,
          weight: data.weight,
          rate: data.rate,
          gstPercent: data.gstPercent,
        };
      });
      const orderDetails = {
        ...this.form.getRawValue(),
        createdBy: 0,
        fibrePODts: fibrePODts,
      } as CreateFibrePO;

      this.subscription.add(
        this.fibreService.submitFibrePO(orderDetails).subscribe({
          next: (response) => {
            this.resetData();
            this.notificationService.success(
              {
                printPO: true,
                poId: response,
                message: 'Purchase order submitted successfully',
              },
              true
            );
          },
          error: (error) => {
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
          },
        })
      );
    }
  }

  goToSearch() {
    this.router.navigateByUrl('purchases/fibre/search');
  }

  hasError() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in party details!',
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
    this.getPoNo();
    this.dataSource = [];
    this.table.renderRows();
  }

  addData(): void {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
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
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
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
