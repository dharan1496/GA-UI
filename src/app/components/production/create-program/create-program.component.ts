import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { ConversionYarn } from 'src/app/models/conversionYarn';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss'],
})
export class CreateProgramComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  dataSource: ConversionYarn[] = [];
  displayedColumns = ['counts', 'quantity', 'button'];
  @ViewChild(MatTable) table!: MatTable<any>;
  shadeList!: YarnShade[];
  countsList!: YarnCounts[];
  blendList!: YarnBlend[];
  subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    public yarnService: YarnService,
    public appSharedService: AppSharedService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      shadeId: '',
      shadeName: ['', Validators.required],
      programDate: ['', Validators.required],
      blendId: '',
      blendName: ['', Validators.required],
      remarks: '',
    });

    this.subscription.add(
      this.yarnService.getYarnShade().subscribe({
        next: (data) => (this.shadeList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.yarnService.getYarnBlend().subscribe({
        next: (data) => (this.blendList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.yarnService.getYarnCounts().subscribe({
        next: (data) => (this.countsList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.form.get('shadeName')?.valueChanges.subscribe((shadeName) => {
        this.form
          .get('shadeId')
          ?.setValue(
            this.shadeList.find((shade) => shade.shadeName === shadeName)
              ?.shadeId
          );
      })
    );

    this.subscription.add(
      this.form.get('blendName')?.valueChanges.subscribe((blendName) => {
        this.form
          .get('blendId')
          ?.setValue(
            this.blendList.find((blend) => blend.blendName === blendName)
              ?.blendId
          );
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addData() {
    this.dialog
      .open(AddYarnComponent, { data: this.dataSource })
      .afterClosed()
      .subscribe((data: ConversionYarn) => {
        if (data) {
          this.dataSource.push(data);
          this.table.renderRows();
        }
      });
  }

  updateData(selectedRow: any) {
    const dialogRef = this.dialog.open(AddYarnComponent, {
      data: {
        selectedRow,
        countsList: this.dataSource,
      },
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
            if (data != selectedRow) {
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
      const yarnCounts: ConversionYarn[] = this.dataSource.map((data) => {
        return {
          conversionYarnId: 0,
          countsId: data.countsId,
          counts: data.counts,
          programQuantity: +data.programQuantity,
          productionQuantity: 0,
        };
      });
      const program: ConversionProgram = {
        ...this.form.value,
        programDate: this.datePipe.transform(
          this.form.value?.programDate,
          'dd/MM/yyyy'
        ),
        programId: 0,
        programNo: '',
        isDeleted: false,
        isClosed: false,
        closedByUserId: 0,
        createdByUserId: 0,
        yarnCounts,
      };
      this.yarnService.createProgram(program).subscribe({
        next: () => {
          this.notificationService.success('Program created successfully');
          this.resetData();
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      });
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
      .map((data: ConversionYarn) => +data.programQuantity)
      .reduce((acc, value) => acc + value, 0);
  }
}
