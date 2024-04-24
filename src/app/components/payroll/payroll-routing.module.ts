import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { AdvancePaymentComponent } from './advance-payment/advance-payment.component';

const routes: Routes = [
  {
    path: '',
    component: UploadAttendanceComponent,
  },
  {
    path: 'salary-calculation',
    component: SalaryCalculationComponent,
  },
  {
    path: 'advance-payment',
    component: AdvancePaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
