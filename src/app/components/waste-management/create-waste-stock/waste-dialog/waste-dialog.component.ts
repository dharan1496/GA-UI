import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreWasteCategory } from 'src/app/models/fibreWasteCategory';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-waste-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './waste-dialog.component.html',
  styleUrls: ['./waste-dialog.component.scss'],
})
export class WasteDialogComponent implements OnInit {
  form!: FormGroup;
  subscription = new Subscription();
  wasteList!: FibreWasteCategory[];

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private fibreService: FibreService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.fibreService.getWasteCategory().subscribe({
        next: (data) => (this.wasteList = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.form = this.formBuilder.group({
      orderNo: typeof this.data === 'number' ? +this.data + 1 : '',
      wasteCategoryId: ['', Validators.required],
      wasteCategoryName: '',
      quantity: ['', Validators.required],
    });

    if (typeof this.data === 'object') {
      this.form.patchValue(this.data);
    }

    this.subscription.add(
      this.form
        .get('wasteCategoryId')
        ?.valueChanges.subscribe((wasteCategoryId) => {
          this.form
            .get('wasteCategoryName')
            ?.setValue(
              this.wasteList.find(
                (data) => data.wasteCategoryId === wasteCategoryId
              )?.wasteCategoryName
            );
        })
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.matDialogRef.close({ ...this.form.value });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.matDialogRef.close();
  }
}
