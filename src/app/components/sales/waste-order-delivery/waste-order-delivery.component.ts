import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { FibreSalesDC } from 'src/app/models/fibreSalesDC';
import { NotifyType } from 'src/app/models/notify';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { YarnOrder } from 'src/app/models/yarnOrder';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { WasteStockDialogComponent } from './waste-stock-dialog/waste-stock-dialog.component';

@Component({
  selector: 'app-waste-order-delivery',
  templateUrl: './waste-order-delivery.component.html',
  styleUrls: ['./waste-order-delivery.component.scss'],
})
export class WasteOrderDeliveryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  displayedColumns: string[] = ['wasteCategoryName', 'quantity', 'action'];
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
    private fibreService: FibreService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.SALES);
    this.navigationService.menu = SALES;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.form = this.formBuilder.group({
      dcNo: ['', Validators.required],
      partyId: ['', Validators.required],
      partyName: '',
      dcDate: ['', Validators.required],
    });

    this.subscription.add(
      this.form
        .get('partyId')
        ?.valueChanges.subscribe((partyId) =>
          this.form
            .get('partyName')
            ?.setValue(
              this.partyService.parties.find(
                (party) => party.partyId === partyId
              )?.partyName
            )
        )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPartyList() {
    this.subscription.add(
      this.partyService.getSalesParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  submitOrder() {
    if (!this.hasError()) {
      const salesDCDetails: any[] = this.dataSource.map((data: any) => ({
        wasteCategoryName: data?.wasteCategoryName,
        wasteCategoryId: data?.wasteCategoryId,
        quantity: data?.stockQuantity,
        yarnShade: '', // Added to avoid API validation
      }));
      const wasteOrder: FibreSalesDC = {
        ...this.form.value,
        dcDate: this.datePipe.transform(this.form.value?.dcDate, 'dd/MM/yyyy'),
        dcId: 0,
        createdByUserId: this.appSharedService.userId,
        salesDCDetails,
      };
      this.subscription.add(
        this.fibreService.createWasteSalesDC(wasteOrder).subscribe({
          next: (response) => {
            this.notificationService.success(response);
            this.resetData();
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

  hasError() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in Sales details!',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add atleast one stock to submit',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
    this.table.renderRows();
  }

  addData(): void {
    this.dialog
      .open(WasteStockDialogComponent, {
        data: {
          existingStocks: this.dataSource,
        },
        minWidth: '60vw',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dataSource = result;
          this.table.renderRows();
        }
      });
  }

  removeStock(selectedRow: any) {
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

  getTotalQuantity() {
    return this.dataSource
      .map((data: any) => data?.stockQuantity)
      .reduce((acc, value) => acc + value, 0);
  }
}
