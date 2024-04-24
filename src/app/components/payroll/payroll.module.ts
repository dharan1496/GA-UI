import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PayrollRoutingModule } from './payroll-routing.module';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';

@NgModule({
  declarations: [UploadAttendanceComponent],
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
