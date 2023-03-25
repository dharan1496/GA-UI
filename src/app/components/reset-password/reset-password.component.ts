import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyType } from 'src/app/models/notify';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from '../notification-snackbar/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
 
  constructor(
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
  ) {
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
    },
    { 
      validators: (formGroup: FormGroup) => {
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordNotMatch: true };
      }
    });
  }

  onReset() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured!', NotifyType.ERROR);
      return;
    }
    this.notificationService.notify('Password changed successfully!', NotifyType.SUCCESS);
  }

}
