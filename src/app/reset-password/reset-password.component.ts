import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
 
  constructor(private formBuilder: FormBuilder, private navigationService: NavigationService) {
    this.navigationService.isSidenavOpened = false;
    this.navigationService.menu = null;
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      confirmPassword: ['', [Validators.required]]
    },{ 
      validators: this.matchPassword.bind(this)
    });
  }

  matchPassword(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  onReset() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

}
