import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/material.module";
import { ResetPasswordRoutingModule } from "./reset-password-routing.module";
import { ResetPasswordComponent } from "./reset-password.component";


@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
  ],
})
export class ResetPasswordModule { }
