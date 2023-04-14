import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-add-fibre-type',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-fibre-type.component.html',
  styleUrls: ['./add-fibre-type.component.scss'],
})
export class AddFibreTypeComponent {
  fibre = new FormControl('', Validators.required);

  constructor(private matDialogRef: MatDialogRef<any>) {}

  submit() {
    if (this.fibre.invalid) {
      this.fibre.markAsTouched();
      return;
    }
    this.close();
  }

  close() {
    this.matDialogRef.close();
  }
}
