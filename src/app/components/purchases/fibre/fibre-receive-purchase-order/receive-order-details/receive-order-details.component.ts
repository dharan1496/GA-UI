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
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';

@Component({
  selector: 'app-receive-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './receive-order-details.component.html',
  styleUrls: ['./receive-order-details.component.scss'],
})
export class ReceiveOrderDetailsComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();
  actualPendingQty = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ReceiveOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    public fibreService: FibreService,
    public appSharedService: AppSharedService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      poDtsId: '',
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      poNo: [{ value: '', disabled: true }],
      fibreTypeId: [{ value: '', disabled: true }],
      fibreType: '',
      shadeName: [{ value: '', disabled: true }],
      hsnCode: ['', Validators.required],
      orderQty: [{ value: '', disabled: true }],
      pendingQty: [{ value: '', disabled: true }],
      receivedQty: ['', Validators.required],
      receivedBales: ['', Validators.required],
      lot: ['', Validators.required],
      rate: ['', Validators.required],
      amount: [{ value: '', disabled: true }],
      gstpercent: ['', Validators.required],
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

    const amount: Record<string, ObservableInput<any>> = {
      receivedQty:
        this.form
          .get('receivedQty')
          ?.valueChanges.pipe(startWith(this.form.get('receivedQty')?.value)) ||
        '',
      rate:
        this.form
          .get('rate')
          ?.valueChanges.pipe(startWith(this.form.get('rate')?.value)) || '',
    };
    this.subscription.add(
      combineLatest(amount).subscribe((value: Record<string, number>) => {
        this.form.get('amount')?.setValue(value['receivedQty'] * value['rate']);
      })
    );

    const totalAmount: Record<string, ObservableInput<any>> = {
      amount:
        this.form
          .get('amount')
          ?.valueChanges.pipe(startWith(this.form.get('amount')?.value)) || '',
      gstpercent:
        this.form
          .get('gstpercent')
          ?.valueChanges.pipe(startWith(this.form.get('gstpercent')?.value)) ||
        '',
    };
    this.subscription.add(
      combineLatest(totalAmount).subscribe((value: Record<string, number>) => {
        this.form
          .get('totalAmount')
          ?.setValue(
            value['amount'] + (value['amount'] * value['gstpercent']) / 100
          );
      })
    );

    if (typeof this.data === 'object') {
      this.form.patchValue({
        ...this.data,
        pendingQty: this.data?.orderQty - this.data?.receivedQty,
        receivedQty: '',
      });
      this.actualPendingQty = this.data?.orderQty - this.data?.receivedQty;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  receivedQtyChange() {
    const received = +this.form.get('receivedQty')?.value;
    const pending = this.actualPendingQty - received;
    this.form.get('pendingQty')?.setValue(this.actualPendingQty);
    if (received <= 0) {
      this.form.get('receivedQty')?.setErrors({ zero: true });
      return;
    }
    if (received > this.actualPendingQty) {
      this.form.get('receivedQty')?.setErrors({ moreThanOrder: true });
      return;
    }
    this.form.get('pendingQty')?.setValue(pending);
    this.form.get('receivedQty')?.setErrors(null);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in receive order details!',
        NotifyType.ERROR
      );
      return;
    }
    this.dialogRef.close({ ...this.form.getRawValue(), isValid: true });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
