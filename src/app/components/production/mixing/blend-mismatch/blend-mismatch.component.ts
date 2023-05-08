import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-blend-mismatch',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './blend-mismatch.component.html',
  styleUrls: ['./blend-mismatch.component.scss'],
})
export class BlendMismatchComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<any>
  ) {}

  continue() {
    this.matDialogRef.close(true);
  }

  cancel() {
    this.matDialogRef.close(false);
  }
}
