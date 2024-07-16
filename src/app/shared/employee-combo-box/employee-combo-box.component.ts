import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription, map, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-employee-combo-box',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [TitleCasePipe],
  templateUrl: './employee-combo-box.component.html',
  styleUrls: ['./employee-combo-box.component.scss'],
})
export class EmployeeComboBoxComponent implements OnInit {
  filteredEmployee!: Employee[];
  subscription = new Subscription();
  employeelist!: Employee[];

  @Input() disabled = false;
  @Input() patch: any;
  @Input() required = true;
  @Input() optional = false;
  @Input() employeeFormControl!: AbstractControl<any, any> | null;
  @Input() set touched(value: boolean) {
    if (value) {
      this.employeeControl.markAsTouched();
    }
  }
  employeeControl = new FormControl<any>('');

  constructor(
    public employeeService: EmployeeService,
    private notificationService: NotificationService,
    private titleCase: TitleCasePipe
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
    if (this.required) {
      this.employeeControl.setValidators(Validators.required);
    }

    if (this.disabled) {
      this.employeeControl.disable();
    }

    if (this.patch) {
      const patchValue = this.employeelist?.find(
        (employee) => employee.employeeId === this.patch
      );
      patchValue && this.employeeControl.patchValue(patchValue);
    }

    this.employeeControl?.valueChanges
      .pipe(
        startWith(''),
        map((value) => {
          let name = '';
          if (value) {
            name =
              typeof value === 'string'
                ? value
                : `${value.firstName} ${value.lastName} - ${value.employeeId}`;
          }
          return name
            ? this._filter(name as string)
            : this.employeelist?.slice();
        })
      )
      .subscribe((employees) => {
        this.filteredEmployee = employees;
      });

    this.employeeControl?.valueChanges.subscribe((value: any) => {
      if (value && value instanceof Object) {
        this.setEmployee(value);
      }
    });

    this.employeeFormControl?.valueChanges.subscribe((value) => {
      if (!value) {
        this.employeeControl.reset();
      }
    });
  }

  onBlur() {
    setTimeout(() => {
      const value = this.employeeControl.value;
      if (value && !(value instanceof Object)) {
        this.employeeControl.reset();
        this.setEmployee('');
      }
      this.employeeFormControl?.markAsTouched();
      this.employeeControl.markAsTouched();
    }, 150);
  }

  getEmployeeList() {
    this.subscription.add(
      this.employeeService.getActiveEmployees().subscribe({
        next: (response) => {
          this.employeelist = response;
          this.filteredEmployee = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  setEmployee(employee: any) {
    let value = employee;
    if (employee) {
      value = employee.employeeId;
    }
    this.employeeFormControl?.setValue(value);
  }

  private _filter(name: string): Employee[] {
    const filterValue = name.toLowerCase();

    return this.employeelist.filter((employee) =>
      `${employee.firstName} ${employee.lastName} - ${employee.employeeId}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  displayFn = (employee: Employee) => {
    return employee && employee.employeeId
      ? this.titleCase.transform(
          `${employee.firstName} ${employee.lastName} - ${employee.employeeId}`
        )
      : '';
  };
}
