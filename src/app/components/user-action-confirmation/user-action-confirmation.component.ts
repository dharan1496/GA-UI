import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-user-action-confirmation',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-action-confirmation.component.html',
  styleUrls: ['./user-action-confirmation.component.scss'],
})
export class UserActionConfirmationComponent {
  constructor(
    private matDialogRef: MatDialogRef<boolean>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {}

  selectYes() {
    this.matDialogRef.close(true);
  }

  selectNo() {
    this.matDialogRef.close(false);
  }
}
