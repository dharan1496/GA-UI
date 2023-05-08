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
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-yarn',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
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
    private yarnService: YarnService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      countsId: '',
      counts: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.subscription.add(
      this.yarnService
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

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

    this.matDialogRef.close(this.form.value);
  }

  close() {
    this.matDialogRef.close();
  }
}
