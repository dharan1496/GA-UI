import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreCategory } from 'src/app/models/fibreCategory';
import { NotifyType } from 'src/app/models/notify';
import { YarnBlendCreate } from 'src/app/models/yarnBlendCreate';
import { YarnBlendFibres } from 'src/app/models/yarnBlendFibres';
import { FibreService } from 'src/app/services/fibre.service';
import { MasterService } from 'src/app/services/master.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { DecimalDirective } from 'src/app/shared/decimalNumberDirective';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-blend',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DecimalDirective,
  ],
  templateUrl: './add-blend.component.html',
  styleUrls: ['./add-blend.component.scss'],
})
export class AddBlendComponent implements OnInit, OnDestroy {
  fibreCategories!: FibreCategory[];
  form!: FormGroup;
  subscription = new Subscription();
  addedFibreCategory: YarnBlendFibres[] = [];
  displayedColumns = ['fibreCategory', 'percentage', 'action'];
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<any>,
    private masterService: MasterService,
    public appSharedService: AppSharedService,
    private fibreService: FibreService
  ) {}

  ngOnInit() {
    this.getFibreCategory();
    this.form = this.formBuilder.group({
      fibreCategoryId: '',
      fibreCategory: ['', Validators.required],
      percentage: ['', Validators.required],
    });

    this.subscription.add(
      this.form
        .get('fibreCategory')
        ?.valueChanges.subscribe((data) =>
          this.form
            .get('fibreCategoryId')
            ?.setValue(
              this.fibreCategories.find(
                (category) => category.fibreCategoryName === data
              )?.fibreCategoryId
            )
        )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkAlreadyAdded(option: string): true | null {
    return (
      this.addedFibreCategory.some(
        (category) => category.fibreCategory === option
      ) || null
    );
  }

  getFibreCategory() {
    this.subscription.add(
      this.fibreService.getFibreCategories().subscribe({
        next: (data) => (this.fibreCategories = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  add() {
    if (this.form.invalid) {
      this.notificationService.notify(
        'Error occured in blend details',
        NotifyType.ERROR
      );
      return;
    }
    this.addedFibreCategory.push(this.form.value);
    this.table.renderRows();
    this.form.reset();
  }

  submit() {
    if (!this.hasError()) {
      // sort fibreCategory by fibreCtaegoryId
      const fibres =
        this.addedFibreCategory.length > 1
          ? this.addedFibreCategory.sort(
              (a, b) => a.fibreCategoryId - b.fibreCategoryId
            )
          : this.addedFibreCategory;
      const blend: YarnBlendCreate = {
        fibres,
        createdByUserId: this.appSharedService.userId,
      };
      this.subscription.add(
        this.masterService.addYarnBlend(blend).subscribe({
          next: () => this.close(),
          error: (error) => {
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
          },
        })
      );
    }
  }

  hasError(): boolean {
    if (this.addedFibreCategory.length === 0) {
      this.notificationService.notify(
        'Please add fibre category for blend!',
        NotifyType.ERROR
      );
      return true;
    }
    const totalPercentage = this.getTotalPercentage();
    if (totalPercentage > 100) {
      this.notificationService.notify(
        'Total percentage is more than 100!',
        NotifyType.ERROR
      );
      return true;
    }
    if (totalPercentage < 100) {
      this.notificationService.notify(
        'Total percentage is less than 100!',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  close() {
    this.matDialogRef.close();
  }

  removeData(fibreCategory: string) {
    this.addedFibreCategory = this.addedFibreCategory.filter(
      (data) => data.fibreCategory !== fibreCategory
    );
    this.table.renderRows();
  }

  getTotalPercentage() {
    return this.addedFibreCategory.reduce(
      (acc, curr) => acc + +curr.percentage,
      0
    );
  }
}
