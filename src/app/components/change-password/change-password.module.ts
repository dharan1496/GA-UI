import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ChangePasswordRoutingModule,
  ],
})
export class ChangePasswordModule {}
