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

interface Counts {
  counts: string;
  countsId: number;
}

@Component({
  selector: 'app-add-production-entry',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-production-entry.component.html',
  styleUrls: ['./add-production-entry.component.scss'],
})
export class AddProductionEntryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  countsList!: Counts[];
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
      entryNo: this.data?.entryNo ? +this.data.entryNo : '',
      countsId: '',
      counts: ['', Validators.required],
      lot: ['', Validators.required],
      productionQty: ['', Validators.required],
      winding: ['', Validators.required],
    });

    this.subscription.add(
      this.form
        .get('counts')
        ?.valueChanges.subscribe((counts) =>
          this.form
            .get('countsId')
            ?.setValue(
              this.countsList.find((data) => data.counts === counts)?.countsId
            )
        )
    );

    if (typeof this.data === 'object') {
      this.countsList = this.data.countsList;
      if (this.data?.selectedRow) {
        this.form.patchValue(this.data.selectedRow);
      }
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
