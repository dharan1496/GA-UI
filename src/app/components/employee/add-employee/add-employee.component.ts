import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { EMPLOYEE } from 'src/app/constants/employee-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { EmployeeService } from 'src/app/services/employee.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  departmentList!: any[];
  idProofTypes = [
    { value: 1, label: 'Aadhaar' },
    { value: 2, label: 'Driving License' },
  ];
  salaryCategories = [
    { value: 1, label: 'DailyWages' },
    { value: 2, label: 'Monthly' },
  ];
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private employeeService: EmployeeService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.EMPLOYEE);
    this.navigationService.menu = EMPLOYEE;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: '',
      departmentId: ['', Validators.required],
      departmentType: '',
      address: ['', Validators.required],
      idProofTypeId: ['', Validators.required],
      idProofType: '',
      idProof: ['', Validators.required],
      salary: ['', Validators.required],
      salaryCategoryId: ['', Validators.required],
      salaryCategoryName: '',
      dateOfJoining: ['', Validators.required],
      allowedLeaveDays: ['', Validators.required],
      contactNo: ['', Validators.required],
    });

    this.subscription.add(
      this.form.get('departmentId')?.valueChanges.subscribe((departmentId) => {
        this.form.get('departmentName')?.setValue(departmentId);
      })
    );

    this.subscription.add(
      this.form
        .get('idProofTypeId')
        ?.valueChanges.subscribe((idProofTypeId) => {
          this.form
            .get('idProofType')
            ?.setValue(
              this.idProofTypes.find((proof) => proof.value === idProofTypeId)
                ?.label
            );
        })
    );

    this.subscription.add(
      this.form
        .get('salaryCategoryId')
        ?.valueChanges.subscribe((salaryCategoryId) => {
          this.form
            .get('salaryCategoryName')
            ?.setValue(
              this.salaryCategories.find(
                (category) => category.value === salaryCategoryId
              )?.label
            );
        })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  resetData() {
    this.form.reset();
  }

  submitEmployee() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in the employee details!',
        NotifyType.ERROR
      );
      return;
    }
    const employee = {
      ...this.form.value,
      dateOfJoining: this.datePipe.transform(
        this.form.value.dateOfJoining,
        'dd/MM/yyyy'
      ),
    };
    this.employeeService.addEmployee(this.form.value).subscribe({
      next: (response) => {
        if (response) {
          this.notificationService
            .success('Added employee successfully!')
            .afterClosed()
            .subscribe(() => this.router.navigateByUrl('/employee'));
        } else {
          this.notificationService.error('Unable to add the employee!');
        }
      },
      error: (error) =>
        this.notificationService.error(
          typeof error?.error === 'string' ? error?.error : error?.message
        ),
    });
  }
}
