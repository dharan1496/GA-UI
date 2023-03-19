import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error-snackbar/error.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<void>, @Inject(MAT_DIALOG_DATA) private data: any, private errorService: ErrorService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      orderNo: +this.data + 1,
      fibre: ['', Validators.required],
      kgs: ['', Validators.required],
      bales: ['', Validators.required],
      rate: ['', Validators.required],
      amount: ['', Validators.required],
      gst: ['', Validators.required],
      totalAmount: [{ value: '50000', disabled: true}],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorService.showError('Error occured in order details!');
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  onCancel() {
    this.dialogRef.close();
  }

}
