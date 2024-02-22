import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, ObservableInput, startWith, combineLatest } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { NotificationService } from 'src/app/shared/notification.service';
import { ReceiveOrderDetailsComponent } from '../../fibre-receive-purchase-order/receive-order-details/receive-order-details.component';
import { FibreShade } from 'src/app/models/fibreShade';

@Component({
  selector: 'app-receive-conversion-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './receive-conversion-details.component.html',
  styleUrls: ['./receive-conversion-details.component.scss'],
})
export class ReceiveConversionDetailsComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();
  fibreShadeList!: FibreShade[];

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
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      fibreTypeId: ['', Validators.required],
      fibreType: '',
      shadeName: '',
      shadeId: ['', Validators.required],
      hsnCode: '',
      receivedQty: ['', Validators.required],
      receivedBales: ['', Validators.required],
      lot: ['', Validators.required],
    });

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
      this.form.get('fibreTypeId')?.valueChanges.subscribe((fibreTypeId) => {
        const filteredFibre = this.fibreService.fibres.filter(
          (fibre) => fibre.fibreTypeId === fibreTypeId
        );
        this.form
          .get('fibreType')
          ?.setValue(filteredFibre.reduce((p, c) => c.fibreType, ''));
      })
    );

    this.subscription.add(
      this.form.get('shadeId')?.valueChanges.subscribe((shadeId) => {
        const filteredShade = this.fibreShadeList.filter(
          (shade) => shade.shadeId === shadeId
        );
        this.form
          .get('shadeName')
          ?.setValue(filteredShade.reduce((p, c) => c.shadeName, ''));
      })
    );

    if (typeof this.data === 'object') {
      this.form.patchValue({ ...this.data });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.dialogRef.close(this.form.getRawValue());
  }

  onCancel() {
    this.dialogRef.close();
  }
}
