import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-close-fibre',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './close-reopen-fibre.component.html',
  styleUrls: ['./close-reopen-fibre.component.scss'],
})
export class CloseReopenFibreComponent {
  remarks = new FormControl();

  constructor(
    private matDialogRef: MatDialogRef<boolean>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectYes() {
    if (this.remarks.valid) {
      this.matDialogRef.close({
        action: 'yes',
        remarks: this.remarks.value || '',
      });
    } else {
      this.remarks.markAsTouched();
    }
  }

  selectNo() {
    this.matDialogRef.close({ action: 'no' });
  }
}
