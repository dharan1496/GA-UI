import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-recovery-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './recovery-details.component.html',
  styleUrls: ['./recovery-details.component.scss'],
})
export class RecoveryDetailsComponent {
  constructor(
    private matDialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.matDialogRef.close();
  }
}
