import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { PartyService } from 'src/app/services/party.service';
import { Subscription } from 'rxjs';
import { FibreService } from 'src/app/services/fibre.service';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Constants } from 'src/app/constants/constants';
import { Router } from '@angular/router';
import { CreateFibrePO } from 'src/app/models/createFibrePO';
import { CreateFibrePODts } from 'src/app/models/createFibrePODts';
import { FibrePO } from 'src/app/models/fibrePO';
import { FibrePODts } from 'src/app/models/fibrePODts';

@Component({
  selector: 'app-fibre-purchase-order',
  templateUrl: './fibre-purchase-order.component.html',
  styleUrls: ['./fibre-purchase-order.component.scss'],
})
export class FibrePurchaseOrderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = [
    'fibreType',
    'shade',
    'weight',
    'rate',
    'amount',
    'gstPercent',
    'totalAmount',
    'button',
  ];
  dataSource: any[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  subscription = new Subscription();
  updatePoDetails?: FibrePO;
  clearSearch = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    private fibreService: FibreService,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      poNo: [{ value: '', disabled: true }],
      partyId: ['', Validators.required],
      pOdate: ['', Validators.required],
    });

    this.getPartyList();
    this.getFibreList();
    if (this.router.url.includes('update-purchase-order')) {
      this.checkForUpdate();
    } else {
      this.getPoNo();
    }
  }

  ngOnDestroy() {
    this.clearSearch && sessionStorage.removeItem('search-fibre-po');
    this.subscription.unsubscribe();
  }

  checkForUpdate() {
    const poDetails = sessionStorage.getItem('poDetails');
    if (poDetails) {
      this.updatePoDetails = JSON.parse(poDetails);
      this.patchUpdateDetails();
      sessionStorage.removeItem('poDetails');
    } else {
      this.router.navigateByUrl('/purchases/fibre/create-purchase-order');
    }
  }

  patchUpdateDetails() {
    this.form.get('poNo')?.setValue(this.updatePoDetails?.pono);
    this.form.get('partyId')?.setValue(this.updatePoDetails?.partyId);
    this.form.get('partyId')?.disable();
    this.form.get('pOdate')?.setValue(this.updatePoDetails?.podate);
    this.form.get('pOdate')?.disable();
    this.dataSource = this.updatePoDetails?.fibrePODts?.map((data, index) => {
      return {
        orderNo: index + 1,
        poDtsId: data?.poDtsId,
        fibreType: data?.fibreType,
        fibreTypeId: data?.fibreTypeId,
        shadeName: data?.shadeName,
        shadeId: data?.shadeId,
        weight: data?.weight,
        rate: data?.rate,
        gstPercent: data?.gstPercent,
        amount: data?.rate * data?.weight,
        totalAmount:
          data?.rate * data?.weight +
          (data?.rate * data?.weight * data?.gstPercent) / 100,
      };
    }) as never[];
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
        createdBy: this.appSharedService.userId,
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
    this.clearSearch = false;
    this.router.navigateByUrl('purchases/fibre/search');
  }

  updateOrder() {
    if (!this.hasError() && this.updatePoDetails) {
      this.updatePoDetails.fibrePODts = this.dataSource.map((data) => {
        const updateDts = this.updatePoDetails?.fibrePODts?.find(
          (dts) => dts.poDtsId === data.poDtsId
        );
        return {
          ...updateDts,
          fibreTypeId: data.fibreTypeId,
          fibreType: data.fibreType,
          shadeId: data.shadeId,
          shadeName: data.shadeName,
          weight: data.weight,
          rate: data.rate,
          gstPercent: data.gstPercent,
          counts: updateDts?.counts || 0,
          length: updateDts?.length || 0,
        };
      }) as FibrePODts[];
      this.fibreService.updateFibrePO(this.updatePoDetails).subscribe({
        next: () => {
          this.notificationService
            .success('Purchase order updated successfully', true)
            .afterClosed()
            .subscribe(() => this.goToSearch());
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
        'Error occured in PO details!',
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
