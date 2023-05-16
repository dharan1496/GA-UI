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
import { WasteCategory } from 'src/app/models/wasteCategory';
import { FibreService } from 'src/app/services/fibre.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';

@Component({
  selector: 'app-add-waste-entry',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './add-waste-entry.component.html',
  styleUrls: ['./add-waste-entry.component.scss'],
})
export class AddWasteEntryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();
  wasteCategorylist: WasteCategory[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private fibreService: FibreService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      entryNo: this.data?.entryNo ? +this.data.entryNo : '',
      wasteCategoryId: '',
      wasteCategoryName: ['', Validators.required],
      wasteQuantity: ['', Validators.required],
    });

    this.subscription.add(
      this.fibreService
        .getWasteCategory()
        .subscribe((data) => (this.wasteCategorylist = data))
    );

    this.subscription.add(
      this.form
        .get('wasteCategoryName')
        ?.valueChanges.subscribe((name) =>
          this.form
            .get('wasteCategoryId')
            ?.setValue(
              this.wasteCategorylist.find(
                (data) => data.wasteCategoryName === name
              )?.wasteCategoryId
            )
        )
    );

    if (this.data?.selectedRow) {
      this.form.patchValue(this.data.selectedRow);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAlreadyAdded(name: string): true | null {
    if (this.data?.entries && Array.isArray(this.data?.entries)) {
      return this.data?.entries.some((data: any) => data === name) || null;
    }
    return null;
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
