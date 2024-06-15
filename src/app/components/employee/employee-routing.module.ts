import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
  },
  {
    path: 'add',
    component: AddEmployeeComponent,
  },
  {
    path: 'update',
    component: AddEmployeeComponent,
  },
  {
    path: 'timesheet',
    component: TimesheetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
