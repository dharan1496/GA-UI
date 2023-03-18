import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackbarComponent } from "./error-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(private snackbar: MatSnackBar) {}

    showError(message?: string) {
        this.snackbar.openFromComponent(ErrorSnackbarComponent, {
          duration: 3000,
          data: message
        });
    }
}
