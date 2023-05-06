import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
export class AddYarnComponent implements OnInit {
  form!: FormGroup;
  countsList?: Observable<YarnCounts[]>;

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
      yarnCount: ['', Validators.required],
      kgs: ['', Validators.required],
    });

    this.countsList = this.yarnService.getYarnCounts();

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data);
    }
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
