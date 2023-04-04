import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotifyType } from '../models/notify';
import { AppSharedService } from './app-shared.service';
import { EmailConfig } from '../config/email.config';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class SendEmailService {
  isInvalid = false;

  constructor(
    private notificationService: NotificationService,
    private appSharedService: AppSharedService,
    private http: HttpClient
  ) {}

  isValid(id: string): Observable<any> {
    return this.http
      .get(`${EmailConfig.abstractAPIUrl}${id}`)
      .pipe(catchError(() => of({})));
  }

  send(id: string) {
    this.isValid(id).subscribe((data) => {
      if (data) {
        if (data?.deliverability === 'DELIVERABLE') {
          this.isInvalid = false;
          this.callElasticEmailAPI(id);
        } else {
          this.isInvalid = true;
          this.notificationService.notify(
            'Email is undeliverable! Please check the entered address.',
            NotifyType.ERROR
          );
        }
      } else {
        this.notificationService.notify(
          'Something went wrong! Please try again later.',
          NotifyType.ERROR
        );
      }
    });
  }

  callElasticEmailAPI(id: string) {
    Email.send({
      Host: EmailConfig.host,
      Username: EmailConfig.usrname,
      Password: EmailConfig.pwd,
      To: id,
      From: EmailConfig.from,
      Subject: EmailConfig.Subject,
      Body: EmailConfig.body(this.appSharedService.genUniqueId()),
    }).then((message: any) => {
      if (message === 'OK') {
        this.notificationService.notify(
          'Link sent to your email',
          NotifyType.SUCCESS
        );
      }
    });
  }
}
