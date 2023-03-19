import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotifyType, Notify } from "../models/notify";
import { NotificationSnackbarComponent } from "./notification-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private snackbar: MatSnackBar) {}

    notify(message: string, type: NotifyType) {
        this.snackbar.openFromComponent(NotificationSnackbarComponent, {
          duration: 3000,
          data: {
            type,
            message
          } as Notify,
        });
    }
}
