import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { YarnBlend } from 'src/app/models/yarnBlend';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { YarnShade } from 'src/app/models/yarnShade';
import { YarnStockByOrderId } from 'src/app/models/yarnStockByOrderId';
import { MasterService } from 'src/app/services/master.service';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-select-yarn-stock',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './select-yarn-stock.component.html',
  styleUrls: ['./select-yarn-stock.component.scss'],
})
export class SelectYarnStockComponent implements OnInit, OnDestroy {
  dataSource: YarnStockByOrderId[] = [];
  displayedColumns = [
    'programNo',
    'programDate',
    'counts',
    'shade',
    'blend',
    'lot',
    'productionQuantity',
    'stockQuantity',
    'select',
  ];
  subscription = new Subscription();
  selection = new SelectionModel<YarnStockByOrderId>(true, []);
  loader = false;
  form!: FormGroup;
  countsList!: YarnCounts[];
  shadeList!: YarnShade[];
  blendList!: YarnBlend[];

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService,
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      lot: ['', Validators.required],
      blendId: '',
      shadeId: '',
      countsId: '',
    });

    this.subscription.add(
      this.masterService.getYarnShade().subscribe({
        next: (data) => (this.shadeList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.masterService.getYarnBlend().subscribe({
        next: (data) => (this.blendList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.masterService.getYarnCounts().subscribe({
        next: (data) => (this.countsList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    if (this.form.invalid) {
      this.notificationService.notify(
        'Please select lot to search',
        NotifyType.ERROR
      );
      return;
    }
    this.loader = true;
    this.selection.clear();
    this.yarnService
      .searchYarnStock(this.form.value)
      .pipe(finalize(() => (this.loader = false)))
      .subscribe({
        next: (stock) => (this.dataSource = stock),
        error: (error) => {
          this.dataSource = [];
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  submit() {
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select atleast one stock to proceed',
        NotifyType.ERROR
      );
      return;
    }

    this.matDialogRef.close(this.selection.selected);
  }

  close() {
    this.matDialogRef.close();
  }

  onReset() {
    this.form.reset();
    this.dataSource = [];
  }
}
