import { Component, ViewChild } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { EMPLOYEE } from 'src/app/constants/employee-menu-values.const';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Observable, Subscription, combineLatest, finalize } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NotifyType } from 'src/app/models/notify';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EmployeeDepartment } from 'src/app/models/EmployeeDepartment';
import { MatPaginator } from '@angular/material/paginator';
import { MonthlyAttendance } from 'src/app/models/monthlyAttendance';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent {
  subscription = new Subscription();
  attendanceDate = new FormControl('', Validators.required);
  displayedColumns = [
    'employee',
    'category',
    'timeIn',
    'timeOut',
    'hours',
    'todaysDepartmentId',
  ];
  timesheetEntries = new MatTableDataSource<any>([]);
  @ViewChild('entry') table!: MatTable<any>;
  departmentList!: EmployeeDepartment[];
  minDate!: Date;
  maxDate!: Date;
  private paginator!: MatPaginator;
  loader = false;
  observable!: Observable<MonthlyAttendance[]>;
  departmentId = new FormControl('', Validators.required);
  @ViewChild('form') form!: NgForm;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.timesheetEntries.paginator = this.paginator;
  }

  constructor(
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public employeeService: EmployeeService,
    private notificationService: NotificationService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.EMPLOYEE);
    this.navigationService.menu = EMPLOYEE;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.employeeService.getEmployeeDepartmentMasters().subscribe({
        next: (response) => {
          this.departmentList = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    const record = {
      attendance: this.attendanceDate.valueChanges,
      department: this.departmentId.valueChanges,
    };

    this.subscription.add(
      combineLatest(record).subscribe((value: any) => {
        const { attendance, department } = value;
        if (attendance && attendance instanceof Date && department) {
          const date = new Date(value);
          this.minDate = new Date(date);
          this.minDate.setDate(1);

          this.maxDate = new Date(date);
          this.maxDate.setMonth(this.maxDate.getMonth() + 1);
          this.maxDate.setDate(0);
          this.getdailyAttendance();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getdailyAttendance() {
    this.loader = true;
    this.subscription.add(
      this.employeeService
        .getDailyAttendance(
          this.datePipe.transform(this.attendanceDate?.value, 'dd/MM/yyyy') ||
            '',
          +(this.departmentId.value || 0)
        )
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (response) => {
            this.timesheetEntries.data = response.map((record) => {
              const inDate = record.firstCheckInTime?.split(' ');
              const outDate = record.lastCheckOutTime?.split(' ');
              const isDaily = record.salaryCategoryId === 1;
              return {
                ...record,
                timeInDate: this.attendanceDate.value,
                timeIn: inDate?.[1] || '',
                timeOutDate: this.formatDate(outDate?.[0] || ''),
                timeOut: outDate?.[1] || '',
                isDaily,
                isMorningPresent: record.isMorningPresent || false,
                isAfterNoonPresent: record.isAfterNoonPresent || false,
              };
            });
          },
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }
    const splitted = date?.split('/');
    return new Date(
      `${splitted[1]?.padStart(2, '0')}/${splitted[0]?.padStart(2, '0')}/${
        splitted[2]
      }`
    );
  }

  timeDifference(element: any) {
    const timeInDate = element.timeInDate;
    const timeOutDate = element.timeOutDate;
    const startTime = element.timeIn;
    const endTime = element.timeOut;

    if (startTime && endTime && timeOutDate && timeInDate) {
      const start = this.parseTime(startTime, timeInDate);
      const end = this.parseTime(endTime, timeOutDate);

      const diffInMilliseconds = end.getTime() - start.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      element.workedHours = `${this.decimalPipe.transform(
        hours,
        '2.0-0'
      )}:${this.decimalPipe.transform(minutes, '2.0-0')}`;
    }
  }

  parseTime(time: string, sdate: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(sdate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  save() {
    if (!this.timesheetEntries.data?.length) {
      this.notificationService.notify(
        'Add atleast one entry!',
        NotifyType.ERROR
      );
      return;
    }

    if (this.form.invalid) {
      this.notificationService.notify(
        'Please fix the errors in the records!',
        NotifyType.ERROR
      );
      return;
    }

    const request = this.timesheetEntries.data?.map((data: any) => {
      const isDaily = data.salaryCategoryId === 1;
      return {
        employeeId: data?.employeeId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        attendanceDate:
          this.datePipe.transform(this.attendanceDate.value, 'dd/MM/yyyy') ||
          '',
        firstCheckInTime: isDaily
          ? this.getDateTime(data?.timeInDate, data?.timeIn)
          : null,
        lastCheckOutTime: isDaily
          ? this.getDateTime(data?.timeOutDate, data?.timeOut)
          : null,
        workedHours: isDaily ? data?.workedHours : null,
        todaysDepartment:
          this.departmentList.find(
            (dep) => dep.departmentId === data?.todaysDepartmentId
          )?.departmentName || '',
        todaysDepartmentId: data?.todaysDepartmentId || 0,
        salaryCategoryId: data?.salaryCategoryId,
        salaryCategoryName: data?.salaryCategoryName,
        isAfterNoonPresent: data?.isAfterNoonPresent || false,
        isMorningPresent: data?.isMorningPresent || false,
      } as MonthlyAttendance;
    });

    this.employeeService
      .saveMonthlyAttendance(
        request,
        this.datePipe.transform(this.attendanceDate.value, 'dd/MM/yyyy') || ''
      )
      .subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.getdailyAttendance();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }

  getDateTime(date: string, time: string) {
    if (date && time) {
      return `${this.datePipe.transform(date, 'dd/MM/yyyy')} ${time}`;
    }
    return null;
  }

  getMinMonth() {
    return this.minDate?.toLocaleString('default', { month: 'long' });
  }

  resetData() {
    this.timesheetEntries.data = [];
    this.table?.renderRows();
    this.attendanceDate.reset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.timesheetEntries.filter = filterValue.trim().toLowerCase();

    if (this.timesheetEntries.paginator) {
      this.timesheetEntries.paginator.firstPage();
    }
  }
}
