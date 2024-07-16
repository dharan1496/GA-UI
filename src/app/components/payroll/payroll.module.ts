import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PayrollRoutingModule } from './payroll-routing.module';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { AdvancePaymentComponent } from './advance-payment/advance-payment.component';
import { MonthlySalaryListComponent } from './monthly-salary-list/monthly-salary-list.component';
import { SalarySummaryComponent } from './salary-summary/salary-summary.component';
import { EmployeeComboBoxComponent } from 'src/app/shared/employee-combo-box/employee-combo-box.component';

@NgModule({
  declarations: [
    UploadAttendanceComponent,
    SalaryCalculationComponent,
    AdvancePaymentComponent,
    MonthlySalaryListComponent,
    SalarySummaryComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    EmployeeComboBoxComponent,
  ],
  providers: [provideNgxMask(), NgxMaskPipe],
})
export class PayrollModule {}
