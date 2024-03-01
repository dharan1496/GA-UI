import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-close-fibre',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './close-fibre.component.html',
  styleUrls: ['./close-fibre.component.scss'],
})
export class CloseFibreComponent {
  remarks = new FormControl();

  constructor(
    private matDialogRef: MatDialogRef<boolean>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectYes() {
    this.matDialogRef.close({
      action: 'yes',
      remarks: this.remarks.value || '',
    });
  }

  selectNo() {
    this.matDialogRef.close({ action: 'no' });
  }
}
