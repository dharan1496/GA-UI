import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, ObservableInput, startWith, Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { FibreService } from 'src/app/services/fibre.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss'],
})
export class OrderDetailsDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<void>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    public fibreService: FibreService,
    public appSharedService: AppSharedService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      fibreTypeId: ['', Validators.required],
      fibreName: '',
      shade: ['', Validators.required],
      weight: ['', Validators.required],
      rate: ['', Validators.required],
      amount: [{ value: '', disabled: true }],
      gstPercent: ['', Validators.required],
      totalAmount: [{ value: '', disabled: true }],
    });

    this.subscription.add(
      this.form.get('fibreTypeId')?.valueChanges.subscribe((fibreTypeId) => {
        const filteredParty = this.fibreService.fibres.filter(
          (fibre) => fibre.fibreTypeId === fibreTypeId
        );
        this.form
          .get('fibreName')
          ?.setValue(filteredParty.reduce((p, c) => c.fibreType, ''));
      })
    );

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data);
    }

    const amount: Record<string, ObservableInput<any>> = {
      weight:
        this.form
          .get('weight')
          ?.valueChanges.pipe(startWith(this.form.get('weight')?.value)) || '',
      rate:
        this.form
          .get('rate')
          ?.valueChanges.pipe(startWith(this.form.get('rate')?.value)) || '',
    };
    this.subscription.add(
      combineLatest(amount).subscribe((value: Record<string, number>) => {
        this.form.get('amount')?.setValue(value['weight'] * value['rate']);
      })
    );

    const totalAmount: Record<string, ObservableInput<any>> = {
      amount:
        this.form
          .get('amount')
          ?.valueChanges.pipe(startWith(this.form.get('amount')?.value)) || '',
      gstPercent:
        this.form
          .get('gstPercent')
          ?.valueChanges.pipe(startWith(this.form.get('gstPercent')?.value)) ||
        '',
    };
    this.subscription.add(
      combineLatest(totalAmount).subscribe((value: Record<string, number>) => {
        this.form
          .get('totalAmount')
          ?.setValue(
            value['amount'] + (value['amount'] * value['gstPercent']) / 100
          );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in order details!',
        NotifyType.ERROR
      );
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  onCancel() {
    this.dialogRef.close();
  }
}
