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
import { Employee } from 'src/app/models/employee';
import { EmployeeDaywiseSalaryDetails } from 'src/app/models/employeeDaywiseSalaryDetails';
import { EmployeeSalary } from 'src/app/models/employeeSalary';
import { NotifyType } from 'src/app/models/notify';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MY_FORMATS } from '../salary-calculation/salary-calculation.component';

@Component({
  selector: 'app-monthly-salary-list',
  templateUrl: './monthly-salary-list.component.html',
  styleUrls: ['./monthly-salary-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MonthlySalaryListComponent {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<EmployeeDaywiseSalaryDetails>([]);
  employeeList!: Employee[];
  selectedEmployee!: Employee | null;
  columnsToDisplay = [
    'attendanceDate',
    'firstCheckInTime',
    'lastCheckOutTime',
    'workedHours',
    'amount',
  ];
  private paginator!: MatPaginator;
  employeeId = new FormControl('', Validators.required);
  paymentMonth = new FormControl(moment(), Validators.required);
  employeeSalary!: EmployeeSalary | null;
  searched = false;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
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

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
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

  ngOnInit(): void {
    this.subscription.add(
      this.employeeService.getActiveEmployees().subscribe({
        next: (data) => (this.employeeList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    if (this.employeeId.invalid || this.paymentMonth.invalid) {
      this.notificationService.notify(
        'Error occured in search details!',
        NotifyType.ERROR
      );
      this.employeeId.markAsTouched();
      this.paymentMonth.markAsTouched();
      return;
    }

    this.selectedEmployee = this.employeeList.find(
      (employee) => employee.employeeId === +(this.employeeId.value || 0)
    ) as Employee;
    const monthDate = this.datePipe.transform(
      `${
        (this.paymentMonth.value?.month() || 0) + 1
      }/01/${this.paymentMonth.value?.year()}`,
      'dd/MM/yyyy'
    );
    this.subscription.add(
      this.employeeService
        .getEmployeeMonthlySalaryDetails(
          +(this.employeeId.value || 0),
          monthDate || ''
        )
        .pipe(finalize(() => (this.searched = true)))
        .subscribe({
          next: (data) => {
            this.employeeSalary = data;
            this.dataSource.data = this.employeeSalary.salaryDetails;
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
    this.employeeId.reset();
    this.paymentMonth.reset(moment());
    this.employeeSalary = null;
    this.searched = false;
  }

  convertToDate(dateTime: string, time: boolean) {
    if (!dateTime) {
      return '';
    }
    const splittedDate = dateTime.split(' ');
    const date = splittedDate[0]?.split('/');
    const formattedDateOnly = `${date[1]}/${date[0]}/${date[2]}`;
    if (!time) {
      return formattedDateOnly;
    }
    return `${formattedDateOnly} ${splittedDate[1] || ''}`;
  }
}
