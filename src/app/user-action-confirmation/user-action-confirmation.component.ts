import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-user-action-confirmation',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-action-confirmation.component.html',
  styleUrls: ['./user-action-confirmation.component.scss']
})
export class UserActionConfirmationComponent {

  constructor(private matDialogRef: MatDialogRef<boolean>) {}

  selectYes() {
    this.matDialogRef.close(true);
  }

  selectNo() {
    this.matDialogRef.close(false);
  }

}
