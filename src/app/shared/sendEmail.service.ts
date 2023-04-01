import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { NotifyType } from "../models/notify";
import { AppSharedService } from "./app-shared.service";
import { EmailConfig } from "../config/email.config";

declare let Email: any; 

@Injectable({
    providedIn: 'root'
})
export class SendEmailService {
    constructor(private notificationService: NotificationService, private appSharedService: AppSharedService) {}

    send(id: string) {
        Email.send({
            Host: EmailConfig.host,
            Username: EmailConfig.username,
            Password: EmailConfig.password,
            To: id,
            From: EmailConfig.from,
            Subject: EmailConfig.Subject,
            Body: EmailConfig.body(this.appSharedService.genUniqueId()),
        }).then((message: any) => {
            if (message === 'OK') {
                this.notificationService.notify('Link sent to your email', NotifyType.SUCCESS);
            }
        });   
    }
}
