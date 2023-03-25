import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { Notify } from '../../models/notify';

@Component({
  selector: 'app-notification-snackbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.scss']
})
export class NotificationSnackbarComponent {
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public notify: Notify) {}
}
