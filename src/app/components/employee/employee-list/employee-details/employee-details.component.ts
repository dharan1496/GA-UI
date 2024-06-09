import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeDetails: Employee,
    private matDialogRef: MatDialogRef<any>,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  close() {
    this.matDialogRef.close();
  }

  updateEmployee() {
    this.employeeService.editEmployeeDetails = this.employeeDetails;
    this.close();
    this.router.navigateByUrl('/employee/update');
  }

  deleteEmployee() {
    // delete
  }
}
