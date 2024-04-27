import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Employee } from 'src/app/models/employee';
import { EmployeeSalaryDetails } from 'src/app/models/employeeSalaryDetails';
import { MonthlyAttendance } from 'src/app/models/monthlyAttendance';
import { NotifyType } from 'src/app/models/notify';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-salary-calculation',
  templateUrl: './salary-calculation.component.html',
  styleUrls: ['./salary-calculation.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SalaryCalculationComponent implements OnInit, OnDestroy {
  loader = false;
  employeelist!: Employee[];
  subscription = new Subscription();
  attendanceData = new MatTableDataSource<MonthlyAttendance>([]);
  displayedColumns = [
    'attendanceDate',
    'firstCheckInTime',
    'lastCheckOutTime',
    'workedHours',
    'amount',
  ];
  private paginator!: MatPaginator;
  paymentMonth = new FormControl(moment(), Validators.required);
  employeeId = new FormControl('', Validators.required);
  deductionAmount = new FormControl('');
  totalSalaryAmount = new FormControl('', Validators.required);

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.attendanceData.paginator = this.paginator;
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

  ngOnInit() {
    this.subscription.add(
      this.employeeService.getActiveEmployees().subscribe({
        next: (response) => {
          this.employeelist = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.subscription.add(
      this.deductionAmount.valueChanges.subscribe((amount) => {
        const salary = this.totalSalaryAmount.value;
        if (salary) {
          const afterDeduction = +salary - +(amount || 0);
          this.totalSalaryAmount.setValue(
            afterDeduction > 0 ? `${afterDeduction}` : '0'
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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

  resetData() {
    this.attendanceData.data = [];
    this.employeeId.reset();
    this.paymentMonth.reset(moment());
    this.deductionAmount.reset();
    this.totalSalaryAmount.reset();
  }

  calculateTotalAmount() {
    const totalAmount = this.attendanceData.data.reduce((acc, cur: any) => {
      return acc + (cur?.amount || 0);
    }, 0);
    const afterDeductionAmount =
      totalAmount - +(this.deductionAmount.value || 0);
    this.totalSalaryAmount.setValue(`${afterDeductionAmount || 0}`);
  }

  fetchAttendance() {
    if (this.employeeId.invalid || this.paymentMonth.invalid) {
      this.employeeId.markAsTouched();
      this.paymentMonth.markAsTouched();
      this.notificationService.notify(
        'Error occured in the attendance fetching details!',
        NotifyType.ERROR
      );
      return;
    }

    this.loader = true;
    const monthDate = this.datePipe.transform(
      `${
        (this.paymentMonth.value?.month() || 0) + 1
      }/01/${this.paymentMonth.value?.year()}`,
      'dd/MM/yyyy'
    );
    this.employeeService
      .getMonthlyAttendanceById(+(this.employeeId.value || 0), monthDate || '')
      .pipe(finalize(() => (this.loader = false)))
      .subscribe({
        next: (response) => {
          if (response?.length) {
            this.attendanceData.data = response;
          } else {
            this.notificationService.error('No records found!');
          }
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }

  submit() {
    if (
      this.employeeId.invalid ||
      this.paymentMonth.invalid ||
      !this.attendanceData.data?.length ||
      this.totalSalaryAmount.invalid
    ) {
      this.employeeId.markAsTouched();
      this.paymentMonth.markAsTouched();
      this.totalSalaryAmount.markAsTouched();
      this.notificationService.error('Error occured in the salary details!');

      return;
    }

    const employeeSalaryDetails: EmployeeSalaryDetails[] =
      this.attendanceData.data.map((data: any) => ({
        attendanceDate: data.attendanceDate,
        amount: data?.amount,
      }));
    const monthDate = this.datePipe.transform(
      `${
        (this.paymentMonth.value?.month() || 0) + 1
      }/01/${this.paymentMonth.value?.year()}`,
      'dd/MM/yyyy'
    );
    this.employeeService
      .saveSalary(
        +(this.employeeId.value || 0),
        monthDate || '',
        +(this.totalSalaryAmount.value || 0),
        +(this.deductionAmount.value || 0),
        employeeSalaryDetails
      )
      .subscribe({
        next: (response) => {
          this.notificationService.error(response);
          this.resetData();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }
}
