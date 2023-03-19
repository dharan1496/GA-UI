import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, filter, startWith, Subscription } from 'rxjs';
import { ErrorService } from 'src/app/error-snackbar/error.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  subscription = new Subscription();

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
      totalAmount: [{ value: '', disabled: true}],
    });
    
    // TODO: Replace combineLatest with any other approach
    const observable1$ = combineLatest([
      this.form.get('kgs')?.valueChanges.pipe(startWith(this.form.get('kgs')?.value)),
      this.form.get('rate')?.valueChanges.pipe(startWith(this.form.get('rate')?.value))
    ]).pipe(filter((data: any[]) => data[0] && data[1])).subscribe(
      (value: any[]) => {
        this.form.get('amount')?.setValue(value[0] * value[1]);
      }
    );
    this.subscription.add(observable1$);

     // TODO: Replace combineLatest with any other approach
    const observable2$ = combineLatest([
      this.form.get('amount')?.valueChanges.pipe(startWith(this.form.get('amount')?.value)),
      this.form.get('gst')?.valueChanges.pipe(startWith(this.form.get('gst')?.value))
    ]).pipe(filter((data: any[]) => data[0] && data[1])).subscribe(
      (value: any[]) => {
        this.form.get('totalAmount')?.setValue(value[0] - (value[0] * value[1]) / 100);
      }
    );
    this.subscription.add(observable2$);
     
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  setAmount() {
    
  }

}
