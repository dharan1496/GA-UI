import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
  ],
})
export class ResetPasswordModule { }
