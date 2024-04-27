import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PAYROLL } from 'src/app/constants/payroll-menu-values.const';
import { Employee } from 'src/app/models/employee';
import { NotifyType } from 'src/app/models/notify';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.scss'],
})
export class AdvancePaymentComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  employeelist!: Employee[];
  subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
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

    this.form = this.formBuilder.group({
      employeeId: ['', Validators.required],
      advanceDate: ['', Validators.required],
      advanceAmount: ['', Validators.required],
      remarks: '',
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  resetData() {
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in the advance payment details!',
        NotifyType.ERROR
      );
      return;
    }
    const { employeeId, advanceDate, advanceAmount, remarks } = this.form.value;
    this.employeeService
      .saveSalaryAdvance(
        employeeId,
        this.datePipe.transform(advanceDate, 'dd/MM/yyyy') || '',
        advanceAmount,
        remarks
      )
      .subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.form.reset();
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }
}
