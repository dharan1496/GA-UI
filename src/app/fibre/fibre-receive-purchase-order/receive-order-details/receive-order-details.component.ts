import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error-snackbar/error.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-receive-order-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './receive-order-details.component.html',
  styleUrls: ['./receive-order-details.component.scss']
})
export class ReceiveOrderDetailsComponent {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<void>, @Inject(MAT_DIALOG_DATA) private data: any, private errorService: ErrorService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      orderNo: +this.data + 1,
      fibre: ['', Validators.required],
      hsnCode: ['', Validators.required],
      orderQty: ['', Validators.required],
      pendingQty: ['', Validators.required],
      receivedQty: ['', Validators.required],
      receivedBales: ['', Validators.required],
      lot: ['', Validators.required],
      rate: ['', Validators.required],
      amount: ['', Validators.required],
      gst: ['', Validators.required],
      totalAmount: [{ value: '50000', disabled: true}],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorService.showError('Error occured in receive order details!');
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  onCancel() {
    this.dialogRef.close();
  }

}
