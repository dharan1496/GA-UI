import { Component, ViewChild } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PAYROLL } from 'src/app/constants/payroll-menu-values.const';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import * as XLSX from 'xlsx';
import { FormControl, Validators } from '@angular/forms';
import { NotifyType } from 'src/app/models/notify';
import { MonthlyAttendance } from 'src/app/models/monthlyAttendance';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EmployeeDepartment } from 'src/app/models/EmployeeDepartment';

@Component({
  selector: 'app-upload-attendance',
  templateUrl: './upload-attendance.component.html',
  styleUrls: ['./upload-attendance.component.scss'],
})
export class UploadAttendanceComponent {
  attendanceData = new MatTableDataSource<MonthlyAttendance>([]);
  monthStartDate = new FormControl('', Validators.required);
  uploadFile = new FormControl('', Validators.required);
  displayedColumns = [
    'employeeId',
    'attendanceDate',
    'firstCheckInTime',
    'lastCheckOutTime',
    'workedHours',
    'todaysDepartment',
  ];
  private paginator!: MatPaginator;
  subscription = new Subscription();
  departmentList!: EmployeeDepartment[];
  isFileValid!: boolean;

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
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        range: 5,
      });
      if (excelData && excelData?.length) {
        this.formatExcelData(excelData);
      } else {
        this.attendanceData.data = [];
        this.notificationService.notify(
          'Something went wrong! Please check the file.',
          NotifyType.ERROR
        );
      }
    };
    reader.readAsBinaryString(file);
  }

  formatExcelData(excelData: any[]) {
    const formatedData = excelData?.map((data) => ({
      employeeId: data['Employee ID'],
      firstName: data['First Name'],
      lastName: data['Last Name'] || '',
      attendanceDate: this.formatDate(data['Date']) || '',
      firstCheckInTime: data['First Check In'] || '',
      lastCheckOutTime: data['Last Check Out'] || '',
      workedHours: data['Total Time'] || '',
      todaysDepartment: data['Department'] || '',
      todaysDepartmentId: this.getDepartmentID(data['Department'] || ''),
      salaryCategoryId: 0,
      salaryCategoryName: '',
    })) as MonthlyAttendance[];
    this.isFileValid = formatedData.every((data) => !!data.employeeId);
    if (this.isFileValid && formatedData?.length) {
      this.attendanceData.data = formatedData;
    } else {
      this.attendanceData.data = [];
      this.notificationService.notify(
        'Something went wrong! Please check the file.',
        NotifyType.ERROR
      );
    }
  }

  getDepartmentID(name: string) {
    return (
      this.departmentList.find((dep) => dep.departmentName === name)
        ?.departmentId || 0
    );
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    let splittedDate;
    if (date.includes('-')) {
      splittedDate = date?.split('-');
    } else {
      splittedDate = date?.split('/');
    }

    return this.datePipe.transform(
      new Date(
        `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`
      ).toISOString(),
      'dd/MM/yyyy'
    );
  }

  resetData() {
    this.monthStartDate.reset();
    this.uploadFile.reset();
    this.attendanceData.data = [];
  }

  submit() {
    if (this.uploadFile.invalid || !this.isFileValid) {
      this.notificationService.notify(
        'Please upload the valid attendance file!',
        NotifyType.ERROR
      );
      return;
    }

    if (this.monthStartDate.invalid) {
      this.monthStartDate.markAsTouched();
      this.notificationService.notify(
        'Please fill the start date!',
        NotifyType.ERROR
      );
      return;
    }

    const request = JSON.parse(JSON.stringify(this.attendanceData.data));
    request?.forEach((data: MonthlyAttendance) => {
      data.firstCheckInTime = this.convertToDate(
        data.firstCheckInTime || '',
        data.attendanceDate
      );
      if (data.firstCheckInTime) {
        data.lastCheckOutTime = this.calculateLastCheckOut(
          data.firstCheckInTime,
          data.lastCheckOutTime,
          data.workedHours
        );
      } else {
        data.lastCheckOutTime = this.convertToDate(
          data.lastCheckOutTime || '',
          data.attendanceDate
        );
      }
    });

    this.employeeService
      .saveMonthlyAttendance(
        request,
        this.datePipe.transform(this.monthStartDate.value, 'dd/MM/yyyy') || ''
      )
      .subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }

  calculateLastCheckOut(
    firstIn: string,
    lastOut: string | null,
    workedHours: string
  ) {
    if (!lastOut) {
      return null;
    }
    const [hours, minutes] = workedHours.split(':').map(Number);
    const firstInDate = new Date(this.getAttendanceDate(firstIn));
    firstInDate.setHours(firstInDate.getHours() + hours);
    firstInDate.setMinutes(firstInDate.getMinutes() + minutes);
    return this.datePipe.transform(firstInDate, 'dd/MM/yyyy HH:mm') || '';
  }

  convertToDate(timeString: string, attendanceDate: string) {
    if (!timeString) {
      return null;
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(this.getAttendanceDate(attendanceDate));
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }

  getAttendanceDate(date: string) {
    const splitDate = date.split('/');
    return `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`;
  }
}
