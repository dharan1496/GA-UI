import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { YarnShade } from 'src/app/models/yarnShade';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { AddYarnComponent } from './add-yarn/add-yarn.component';
import { MatTable } from '@angular/material/table';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { NotifyType } from 'src/app/models/notify';
import { NotificationService } from 'src/app/shared/notification.service';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { YarnBlend } from 'src/app/models/yarnBlend';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss'],
})
export class CreateProgramComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  dataSource = [];
  displayedColumns = ['yarnCount', 'kgs', 'button'];
  @ViewChild(MatTable) table!: MatTable<any>;
  shadeList!: Observable<YarnShade[]>;
  countsList!: YarnCounts[];
  blendList!: Observable<YarnBlend[]>;
  subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    public yarnService: YarnService,
    public appSharedService: AppSharedService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      shadeNo: ['', Validators.required],
      progDate: ['', Validators.required],
      blend: ['', Validators.required],
      remarks: '',
    });
    this.shadeList = this.yarnService.getYarnShade();
    this.blendList = this.yarnService.getYarnBlend();
    this.subscription.add(
      this.yarnService
        .getYarnCounts()
        .subscribe((data) => (this.countsList = data))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCounts(counts: string): string {
    return (
      this.countsList?.find((count) => count.countsId === +counts)?.counts || ''
    );
  }

  addData() {
    this.dialog
      .open(AddYarnComponent)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.dataSource.push(data as never);
          this.table.renderRows();
        }
      });
  }

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(AddYarnComponent, {
      data: selectedRow,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.forEach((data: any, index: number) => {
          if (data?.orderNo === result?.orderNo) {
            this.dataSource[index] = result as never;
          }
        });
      }
      this.table.renderRows();
    });
  }

  removeData(selectedRow: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          const newList: any = [];
          this.dataSource.forEach((data: any) => {
            if (data?.orderNo != selectedRow?.orderNo) {
              newList.push(data);
            }
          });
          this.dataSource = newList;
          this.table.renderRows();
        }
      });
  }

  submitProgram() {
    if (!this.hasError()) {
      // submit
    }
  }

  hasError() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in program details!',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.dataSource.length) {
      this.notificationService.notify(
        'Please add the yarn details!',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
  }

  getTotalKgs() {
    return this.dataSource
      .map((data: any) => +data?.kgs)
      .reduce((acc, value) => acc + value, 0);
  }
}
