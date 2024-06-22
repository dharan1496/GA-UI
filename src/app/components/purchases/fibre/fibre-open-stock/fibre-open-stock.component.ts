import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
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
import { DatePipe } from '@angular/common';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { OpeningStockFibreDts } from 'src/app/models/openingStockFibreDts';

@Component({
  selector: 'app-fibre-open-stock',
  templateUrl: './fibre-open-stock.component.html',
  styleUrls: ['./fibre-open-stock.component.scss'],
})
export class FibreOpenStockComponent implements OnInit, OnDestroy {
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
  stockAddedDate = new FormControl('', Validators.required);

  constructor(
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
    if (this.stockAddedDate.invalid) {
      this.stockAddedDate.markAsTouched();
      this.notificationService.notify(
        'Enter the correct stock added date!',
        NotifyType.ERROR
      );
      return;
    }

    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add the stock details!',
        NotifyType.ERROR
      );
      return;
    }

    const request = this.dataSource.map((data: any) => {
      return {
        receivedDCId: data?.receivedDCId || 0,
        receivedDtsId: data?.receivedDtsId || 0,
        lot: data?.lot,
        hsnCode: data?.hsnCode,
        stockWeight: data?.receivedQty,
        stockBales: data?.receivedBales,
        fiberShadeId: data?.shadeId,
        fiberShadeName: data?.shadeName,
        fiberTypeId: data?.fibreTypeId,
        fiberTypeName: data?.fibreType,
        availableBalance: data?.availableBalance || 0,
        stockAddedDate: this.datePipe.transform(
          this.stockAddedDate.value,
          'dd/MM/yyyy'
        ),
      } as OpeningStockFibreDts;
    });

    this.subscription.add(
      this.fibreService.receiveFiberOpeningStock(request).subscribe({
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
    this.stockAddedDate.reset();
    this.dataSource = [];
    this.table.renderRows();
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
}
