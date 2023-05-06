import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-blend',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-blend.component.html',
  styleUrls: ['./add-blend.component.scss'],
})
export class AddBlendComponent implements OnInit {
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
    private yarnService: YarnService,
    public appSharedService: AppSharedService
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

  checkAlreadyAdded(option: string): true | null {
    return (
      this.addedFibreCategory.some(
        (category) => category.fibreCategory === option
      ) || null
    );
  }

  getFibreCategory() {
    // TEMP
    this.fibreCategories = [
      {
        fibreCategoryId: 1,
        fibreCategoryName: 'Polyster',
        categoryCode: 'P',
        categoryOrder: 1,
      },
      {
        fibreCategoryId: 2,
        fibreCategoryName: 'Viscose',
        categoryCode: 'V',
        categoryOrder: 2,
      },
      {
        fibreCategoryId: 3,
        fibreCategoryName: 'Cotton',
        categoryCode: 'C',
        categoryOrder: 3,
      },
    ];
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
      const blend: YarnBlendCreate = {
        fibres: this.addedFibreCategory,
        createdByUserId: 0,
      };
      this.subscription.add(
        this.yarnService.addYarnBlend(blend).subscribe(() => this.close())
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
