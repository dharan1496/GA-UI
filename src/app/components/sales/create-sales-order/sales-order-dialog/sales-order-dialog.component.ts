import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, ObservableInput, startWith, combineLatest } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreShade } from 'src/app/models/fibreShade';
import { NotifyType } from 'src/app/models/notify';
import { YarnBlend } from 'src/app/models/yarnBlend';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { FibreService } from 'src/app/services/fibre.service';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-sales-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './sales-order-dialog.component.html',
  styleUrls: ['./sales-order-dialog.component.scss'],
})
export class SalesOrderDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  fibreShadeList!: FibreShade[];
  countsList!: YarnCounts[];
  blendList!: YarnBlend[];
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<void>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private yarnService: YarnService,
    public appSharedService: AppSharedService
  ) {}

  ngOnInit(): void {
    this.fetchValues();

    this.form = this.formBuilder.group({
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      countsId: ['', Validators.required],
      countsName: '',
      yarnType: ['', Validators.required],
      blendId: ['', Validators.required],
      blendName: '',
      shadeId: ['', Validators.required],
      shadeName: '',
      weight: ['', Validators.required],
      rate: ['', Validators.required],
      amount: '',
      gstPercent: ['', Validators.required],
      totalAmount: '',
    });

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data);
    }

    this.subscription.add(
      this.form.get('countsId')?.valueChanges.subscribe((countsId) => {
        this.form
          .get('countsName')
          ?.setValue(
            this.countsList.find((data) => data.countsId === countsId)?.counts
          );
      })
    );

    this.subscription.add(
      this.form.get('blendId')?.valueChanges.subscribe((blendId) => {
        this.form
          .get('blendName')
          ?.setValue(
            this.blendList.find((data) => data.blendId === blendId)?.blendName
          );
      })
    );

    this.subscription.add(
      this.form.get('shadeId')?.valueChanges.subscribe((shadeId) => {
        this.form
          .get('shadeName')
          ?.setValue(
            this.fibreShadeList?.find((shade) => shade.shadeId === shadeId)
              ?.shadeName
          );
      })
    );

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

  fetchValues() {
    this.subscription.add(
      this.fibreService.getFibreShade().subscribe({
        next: (data) => (this.fibreShadeList = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.subscription.add(
      this.yarnService.getYarnCounts().subscribe({
        next: (data) => (this.countsList = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.subscription.add(
      this.yarnService.getYarnBlend().subscribe({
        next: (data) => (this.blendList = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
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
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
