import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotificationService } from '../../shared/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  credentialsError = false;
  validationError = '';

  get password() {
    return this.form.get('password');
  }
  get username() {
    return this.form.get('username');
  }

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private appSharedService: AppSharedService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (localStorage.getItem('loggedIn')) {
      this.appSharedService.logout = false;
      this.router.navigateByUrl('/home');
      return;
    }
    this.appSharedService.logout = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please enter valid credentials!',
        NotifyType.ERROR
      );
      return;
    }
    this.credentialsError = false;
    this.userService
      .login(this.username?.value, this.password?.value)
      .subscribe({
        next: (response) => {
          this.appSharedService.userId = +response;
          this.router.navigateByUrl('/home');
          this.appSharedService.logout = false;
          this.appSharedService.username = this.username?.value;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', this.username?.value);
          localStorage.setItem('userId', response);
        },
        error: (error) => {
          this.notificationService.error(error?.error);
        },
      });
  }

  forgotPassword() {
    this.router.navigateByUrl('/reset-password');
  }
}
