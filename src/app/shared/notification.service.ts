import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotifyType, Notify } from "../models/notify";
import { NotificationSnackbarComponent } from "../components/notification-snackbar/notification-snackbar.component";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogComponent } from "../components/error-dialog/error-dialog.component";
import { SuccessDialogComponent } from "../components/success-dialog/success-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private snackbar: MatSnackBar, private dialog: MatDialog) {}

    notify(message: string, type: NotifyType) {
        this.snackbar.openFromComponent(NotificationSnackbarComponent, {
          duration: 3000,
          data: {
            type,
            message
          } as Notify,
        });
    }

    error(message: any) {
      this.dialog.open(ErrorDialogComponent, { data: message });
    }

    success(message: any, overlayDisable?: boolean) {
      this.dialog.open(SuccessDialogComponent, { data: message, disableClose: overlayDisable || false });
    }
}
