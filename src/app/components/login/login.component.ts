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
import { SendEmailService } from 'src/app/shared/sendEmail.service';
import { HttpClient } from '@angular/common/http';
import { Credential } from 'src/app/models/credential';

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
    private emailService: SendEmailService,
    private httpClient: HttpClient
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
    this.httpClient
      .get<Credential[]>('./assets/json/credentials.json')
      .subscribe({
        next: (data) => {
          const credential = data.find(
            (item) => item?.username === this.username?.value
          );
          if (!credential) {
            this.credentialsError = true;
            this.validationError = 'The username you entered is incorrect.';
            return;
          }
          if (credential.password !== this.password?.value) {
            this.credentialsError = true;
            this.validationError = 'The password you entered is incorrect.';
            return;
          }
          this.router.navigateByUrl('/home');
          this.appSharedService.logout = false;
          this.appSharedService.username = this.username?.value;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', this.username?.value);
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
