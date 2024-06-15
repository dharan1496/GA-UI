import { Component, ViewChild } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { EMPLOYEE } from 'src/app/constants/employee-menu-values.const';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Subscription, min } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { NotificationService } from 'src/app/shared/notification.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NotifyType } from 'src/app/models/notify';
import { MatDialog } from '@angular/material/dialog';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent {
  employeelist!: Employee[];
  subscription = new Subscription();
  employeeId = new FormControl('', Validators.required);
  displayedColumns = ['date', 'timeIn', 'timeOut', 'hours', 'action'];
  form!: FormGroup;
  timesheetEntries: any = [];
  @ViewChild('entry') table!: MatTable<any>;

  constructor(
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public employeeService: EmployeeService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private decimalPipe: DecimalPipe
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.EMPLOYEE);
    this.navigationService.menu = EMPLOYEE;
  }

  ngOnInit(): void {
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

    this.employeeId.valueChanges.subscribe(() => {
      this.form.reset();
      this.timesheetEntries = [];
      this.table.renderRows();
    });

    this.form = this.formBuilder.group({
      date: '',
      timeIn: '',
      timeOut: '',
      hours: '',
    });
  }

  addEntry() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Fill all entry fields!',
        NotifyType.ERROR
      );
      return;
    }
    this.timeDifference();
    this.timesheetEntries.push(this.form.value);
    this.table.renderRows();
    this.form.reset();
  }

  timeDifference() {
    const startTime = this.form.get('timeIn')?.value;
    const endTime = this.form.get('timeOut')?.value;

    if (startTime && endTime) {
      const start = this.parseTime(startTime);
      const end = this.parseTime(endTime);

      const diffInMilliseconds = end.getTime() - start.getTime();
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      this.form
        .get('hours')
        ?.setValue(
          `${
            hours < 0
              ? 12 - Math.abs(hours) + 12
              : this.decimalPipe.transform(hours, '2.0-0')
          }:${
            minutes < 0
              ? 60 - Math.abs(minutes)
              : this.decimalPipe.transform(minutes, '2.0-0')
          }`
        );
    }
  }

  parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  removeEntry(entry: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const newList: any = [];
          this.timesheetEntries.forEach((data: any) => {
            if (data != entry) {
              newList.push(data);
            }
          });
          this.timesheetEntries = newList;
          this.table.renderRows();
        }
      });
  }

  resetData() {
    this.form.reset();
    this.timesheetEntries = [];
    this.table.renderRows();
    this.employeeId.reset();
  }
}
