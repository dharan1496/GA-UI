import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

@NgModule({
  declarations: [
    AddEmployeeComponent,
    EmployeeListComponent,
    TimesheetComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideNgxMask(), NgxMaskPipe],
})
export class EmployeeModule {}
