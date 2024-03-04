import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { YarnDeliverySummary } from 'src/app/models/yarnDeliverySummary';
import { FibreService } from 'src/app/services/fibre.service';
import { FibreSalesDC } from 'src/app/models/fibreSalesDC';
import { WasteDetailsComponent } from './waste-details/waste-details.component';

@Component({
  selector: 'app-search-waste-delivery',
  templateUrl: './search-waste-delivery.component.html',
  styleUrls: ['./search-waste-delivery.component.scss'],
})
export class SearchWasteDeliveryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  minDate = new Date();
  maxDate = new Date();
  subscription = new Subscription();
  dataSource = new MatTableDataSource<FibreSalesDC>([]);
  columnsToDisplay = ['dcNo', 'dcDate', 'partyName'];
  loader = false;
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
    private fibreService: FibreService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      partyId: ['', Validators.required],
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
    const observable = this.fibreService.getFiberWasteSalesByParty(
      this.form.get('partyId')?.value || '',
      this.datePipe.transform(
        this.form.get('startDate')?.value,
        'dd/MM/yyyy'
      ) || '',
      this.datePipe.transform(this.form.get('endDate')?.value, 'dd/MM/yyyy') ||
        ''
    );
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
  }

  openWasteDetails(row: YarnDeliverySummary) {
    this.dialog.open(WasteDetailsComponent, { data: row, minWidth: '50vw' });
  }

  formatDate(date: any) {
    const formatedDate = new Date(date);
    if (formatedDate.toString() !== 'Invalid Date') {
      return formatedDate;
    }
    return new Date(date.split(' ')[0]);
  }
}
