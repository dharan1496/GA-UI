import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public message: any, private matDialogRef: MatDialogRef<void>) {}

  close() {
    this.matDialogRef.close();
  }
}
