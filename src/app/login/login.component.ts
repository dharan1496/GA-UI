import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSharedService } from '../shared/app-shared.service';
import { MaterialModule } from '../material.module';
import { NotifyType } from '../models/notify';
import { NotificationService } from '../notification-snackbar/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form!: FormGroup;
  showPassword = false;

  get password() { return this.form.get('password'); }
  get username() { return this.form.get('username'); }

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private appSharedService: AppSharedService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
    if (!!localStorage.getItem('loggedIn')) {
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
      this.notificationService.notify('Please enter valid credentials!', NotifyType.ERROR);
      return;
    }
    // TEMP - start
    if (this.username?.value !== 'admin') {
      this.notificationService.notify('Error: Username do not match', NotifyType.ERROR);
      return;
    } 
    if (this.password?.value !== '@admin') {
      this.notificationService.notify('Error: Password do not match', NotifyType.ERROR);
      return;
    }
    // TEMP - end
    this.router.navigateByUrl('/home');
    this.appSharedService.logout = false;
    this.appSharedService.username = this.username?.value;
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', this.username?.value);
  }

}
