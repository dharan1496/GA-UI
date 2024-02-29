import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { MasterService } from 'src/app/services/master.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-yarn',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './add-yarn.component.html',
  styleUrls: ['./add-yarn.component.scss'],
})
export class AddYarnComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  countsList!: YarnCounts[];
  subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      orderNo: Array.isArray(this.data) ? this.data.length + 1 : '',
      countsId: '',
      counts: ['', Validators.required],
      programQuantity: ['', Validators.required],
      productionQuantity: 0,
    });

    this.subscription.add(
      this.masterService
        .getYarnCounts()
        .subscribe((data) => (this.countsList = data))
    );

    this.subscription.add(
      this.form.get('counts')?.valueChanges.subscribe((counts) => {
        this.form
          .get('countsId')
          ?.setValue(
            this.countsList?.find((data) => data.counts === counts)?.countsId
          );
      })
    );

    if (!Array.isArray(this.data) && this.data?.selectedRow) {
      this.form.patchValue(this.data.selectedRow);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAlreadyAdded(counts: string): true | null {
    const array = Array.isArray(this.data) ? this.data : this.data.counts;
    return array.some((data: any) => data['counts'] === counts) || null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in yarn details!',
        NotifyType.ERROR
      );
      return;
    }

    if (typeof this.data === 'object') {
      const result = { ...this.data?.selectedRow, ...this.form.value };
      !result?.countsId && (result.countsId = this.data?.selectedRow?.countsId);
      this.matDialogRef.close(result);
    } else {
      this.matDialogRef.close(this.form.value);
    }
  }

  close() {
    this.matDialogRef.close();
  }
}
