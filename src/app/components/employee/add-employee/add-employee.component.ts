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
import { EmployeeDepartment } from 'src/app/models/EmployeeDepartment';
import { IDProof } from 'src/app/models/idProof';
import { SalaryCategory } from 'src/app/models/salaryCategory';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  departmentList!: EmployeeDepartment[];
  idProofTypes!: IDProof[];
  salaryCategories!: SalaryCategory[];
  subscription = new Subscription();
  edit = false;

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

    this.subscription.add(
      this.employeeService.getIDProofs().subscribe({
        next: (response) => {
          this.idProofTypes = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.subscription.add(
      this.employeeService.getSalaryCategories().subscribe({
        next: (response) => {
          this.salaryCategories = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.form = this.formBuilder.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: '',
      departmentId: ['', Validators.required],
      departmentName: '',
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
        this.form
          .get('departmentName')
          ?.setValue(
            this.departmentList.find(
              (option) => option.departmentId === departmentId
            )?.departmentName
          );
      })
    );

    this.subscription.add(
      this.form
        .get('idProofTypeId')
        ?.valueChanges.subscribe((idProofTypeId) => {
          this.form
            .get('idProofType')
            ?.setValue(
              this.idProofTypes?.find(
                (proof) => proof.idProofTypeId === idProofTypeId
              )?.idProofType
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
                (category) => category.salaryCategoryId === salaryCategoryId
              )?.salaryCategoryName
            );
        })
    );

    if (this.employeeService.editEmployeeDetails) {
      setTimeout(() => {
        this.handleUpdate();
        document.querySelector('.container')?.scrollIntoView();
      }, 250);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.employeeService.editEmployeeDetails = null;
  }

  handleUpdate() {
    this.edit = true;
    const doj =
      this.employeeService.editEmployeeDetails?.dateOfJoining?.split('/');
    let updatedDoj;
    if (doj && doj?.length) {
      updatedDoj = { dateOfJoining: new Date(`${doj[1]}/${doj[0]}/${doj[2]}`) };
    }
    this.form.patchValue({
      ...this.employeeService.editEmployeeDetails,
      ...updatedDoj,
      idProofTypeId:
        this.employeeService.editEmployeeDetails?.idProofTypeId || '',
      salaryCategoryId:
        this.employeeService.editEmployeeDetails?.salaryCategoryId || '',
    });
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
    if (!this.edit) {
      this.employeeService.addEmployee(employee).subscribe({
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
    } else {
      this.employeeService.updateEmployee(employee).subscribe({
        next: (response) => {
          if (response) {
            this.notificationService
              .success(response)
              .afterClosed()
              .subscribe(() => this.router.navigateByUrl('/employee'));
          } else {
            this.notificationService.error('Unable to update the employee!');
          }
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
    }
  }
}
