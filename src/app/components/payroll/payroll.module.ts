import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PayrollRoutingModule } from './payroll-routing.module';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { AdvancePaymentComponent } from './advance-payment/advance-payment.component';

@NgModule({
  declarations: [
    UploadAttendanceComponent,
    SalaryCalculationComponent,
    AdvancePaymentComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask(), NgxMaskPipe],
})
export class PayrollModule {}
