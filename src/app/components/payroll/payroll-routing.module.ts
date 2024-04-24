import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: UploadAttendanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
