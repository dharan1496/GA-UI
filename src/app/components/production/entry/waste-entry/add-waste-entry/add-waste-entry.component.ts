import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-waste-entry',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-waste-entry.component.html',
  styleUrls: ['./add-waste-entry.component.scss'],
})
export class AddWasteEntryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      entryNo: typeof this.data === 'number' ? +this.data : '',
      wasteCategory: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data.selectedRow);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in entry details!',
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
