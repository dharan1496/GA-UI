import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee';

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
    private matDialogRef: MatDialogRef<any>
  ) {}

  close() {
    this.matDialogRef.close();
  }

  updateEmployee() {
    // update
  }

  deleteEmployee() {
    // delete
  }
}
