import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from '../../shared/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { SendEmailService } from 'src/app/shared/sendEmail.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  id!: string;
  generatedId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private appSharedService: AppSharedService,
    public emailService: SendEmailService,
    private router: Router
  ) {
    this.appSharedService.logout = true;
  }

  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  get email() {
    return this.form.get('email');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'] || '';
    if (this.id) {
      this.generatedId = localStorage.getItem('id') || '';
      if (this.generatedId === this.id) {
        this.form = this.formBuilder.group(
          {
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
          },
          {
            validators: (formGroup: FormGroup) => {
              const password = formGroup.get('password')?.value;
              const confirmPassword = formGroup.get('confirmPassword')?.value;
              return password === confirmPassword
                ? null
                : { passwordNotMatch: true };
            },
          }
        );
      } else {
        this.router.navigateByUrl('/login');
      }
    } else {
      this.form = this.formBuilder.group({
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
      });
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('id');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured!', NotifyType.ERROR);
      return;
    }
    this.emailService.send(this.email?.value);
    this.form.reset();
  }

  onReset() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify('Error occured!', NotifyType.ERROR);
      return;
    }
    this.notificationService.notify(
      'Password changed successfully!',
      NotifyType.SUCCESS
    );
    setTimeout(() => this.router.navigateByUrl('/login'), 1000);
    this.form.reset();
  }

  backToLogin() {
    this.router.navigateByUrl('/login');
  }
}
