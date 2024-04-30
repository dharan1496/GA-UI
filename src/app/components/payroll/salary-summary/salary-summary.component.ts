import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PAYROLL } from 'src/app/constants/payroll-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MY_FORMATS } from '../salary-calculation/salary-calculation.component';
import { MonthlySalarySummary } from 'src/app/models/monthlySalarySummary';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-salary-summary',
  templateUrl: './salary-summary.component.html',
  styleUrls: ['./salary-summary.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SalarySummaryComponent {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<MonthlySalarySummary>([]);
  columnsToDisplay = [
    'employeeId',
    'employeeName',
    'salaryMonthDate',
    'salaryAmount',
    'deductionAmount',
  ];
  private paginator!: MatPaginator;
  paymentMonth = new FormControl(moment(), Validators.required);
  loader = false;
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
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.PAYROLL);
    this.navigationService.menu = PAYROLL;
  }

  setMonthAndYear(
    normalizedMonthAndYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const ctrlValue = this.paymentMonth.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.paymentMonth.setValue(ctrlValue);
    datepicker.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    if (this.paymentMonth.invalid) {
      this.notificationService.notify('Please fill month', NotifyType.ERROR);
      this.paymentMonth.markAsTouched();
      return;
    }

    this.loader = true;
    const monthDate = this.datePipe.transform(
      `${
        (this.paymentMonth.value?.month() || 0) + 1
      }/01/${this.paymentMonth.value?.year()}`,
      'dd/MM/yyyy'
    );
    this.subscription.add(
      this.employeeService
        .getMonthlySalarySummary(monthDate || '')
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => {
            this.dataSource.data = data;
          },
          error: (error) => {
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
          },
        })
    );
  }

  onReset() {
    this.paymentMonth.reset(moment());
    this.dataSource.data = [];
  }

  print() {
    //
  }
}
