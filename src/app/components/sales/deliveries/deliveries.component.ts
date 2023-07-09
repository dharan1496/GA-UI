import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { YarnDeliverySummary } from 'src/app/models/yarnDeliverySummary';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DeliveryDetailsComponent } from './delivery-details/delivery-details.component';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
})
export class DeliveriesComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  minDate = new Date();
  maxDate = new Date();
  subscription = new Subscription();
  dataSource = new MatTableDataSource<YarnDeliverySummary>([]);
  columnsToDisplay = [
    'dcNo',
    'dcDate',
    'orderNo',
    'partyName',
    'counts',
    'shadeName',
    'blendName',
    'hsnCode',
    'orderQuantity',
    'deliveredQuantity',
  ];
  loader = false;
  searchByOrderId = false;
  private paginator!: MatPaginator;
  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public partyService: PartyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public appSharedService: AppSharedService,
    private notificationService: NotificationService,
    private yarnService: YarnService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private printService: PrintService
  ) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      partyId: '',
    });

    this.setMinDate();
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setMinDate() {
    this.minDate.setMonth(this.minDate.getMonth() - 12);
  }

  onSearch() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please select the date range to search',
        NotifyType.ERROR
      );
      return;
    }
    this.loader = true;
    let observable;
    if (this.searchByOrderId) {
      observable = this.yarnService.getYarnDeliveriesByOrderId(
        this.form.get('orderId')?.value
      );
    } else {
      observable = this.yarnService.getYarnDeliveries(
        this.form.get('partyId')?.value || '',
        this.datePipe.transform(
          this.form.get('startDate')?.value,
          'dd/MM/yyyy'
        ) || '',
        this.datePipe.transform(
          this.form.get('endDate')?.value,
          'dd/MM/yyyy'
        ) || ''
      );
    }
    this.subscription.add(
      observable.pipe(finalize(() => (this.loader = false))).subscribe({
        next: (result) => (this.dataSource.data = result),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  onReset() {
    this.form.reset();
  }

  onChange(event: any) {
    const value = event?.checked;
    if (value) {
      this.form.addControl('orderId', new FormControl('', Validators.required));
      this.form?.removeControl('startDate');
      this.form?.removeControl('endDate');
      this.form?.removeControl('partyId');
    } else {
      this.form.addControl(
        'startDate',
        new FormControl('', Validators.required)
      );
      this.form.addControl('endDate', new FormControl('', Validators.required));
      this.form?.addControl('partyId', new FormControl(''));
      this.form?.removeControl('orderId');
    }
    this.searchByOrderId = value;
  }

  openDeliveryDetails(row: YarnDeliverySummary) {
    this.subscription.add(
      this.dialog
        .open(DeliveryDetailsComponent, { data: row, minWidth: 900 })
        .afterClosed()
        .subscribe(() => (this.printService.yarnDCPrint = false))
    );
  }
}
