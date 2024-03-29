import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { YarnShade } from 'src/app/models/yarnShade';
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
import { MasterService } from 'src/app/services/master.service';
import { ConversionService } from 'src/app/services/conversion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss'],
})
export class CreateProgramComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  dataSource: ConversionYarn[] = [];
  displayedColumns = ['counts', 'programQuantity', 'button'];
  @ViewChild(MatTable) table!: MatTable<any>;
  shadeList!: YarnShade[];
  countsList!: YarnCounts[];
  blendList!: YarnBlend[];
  subscription = new Subscription();
  updateProgramDetails!: ConversionProgram;
  clearSearch = true;

  constructor(
    private navigationService: NavigationService,
    private masterService: MasterService,
    private conversionService: ConversionService,
    public appSharedService: AppSharedService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private router: Router
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

    if (this.router.url.includes('update-program')) {
      this.checkForUpdate();
    } else {
      this.subscription.add(
        this.form.get('shadeName')?.valueChanges.subscribe((shadeName) => {
          this.form
            .get('shadeId')
            ?.setValue(
              this.shadeList?.find((shade) => shade.shadeName === shadeName)
                ?.shadeId
            );
        })
      );

      this.subscription.add(
        this.form.get('blendName')?.valueChanges.subscribe((blendName) => {
          this.form
            .get('blendId')
            ?.setValue(
              this.blendList?.find((blend) => blend.blendName === blendName)
                ?.blendId
            );
        })
      );
    }
  }

  ngOnDestroy() {
    this.clearSearch && sessionStorage.removeItem('search-program');
    this.subscription.unsubscribe();
  }

  checkForUpdate() {
    const programDetails = sessionStorage.getItem('program');
    if (programDetails) {
      this.displayedColumns = [
        'counts',
        'programQuantity',
        'productionQuantity',
        'button',
      ];
      this.updateProgramDetails = JSON.parse(programDetails);
      this.patchUpdateDetails();
      sessionStorage.removeItem('program');
    } else {
      this.router.navigateByUrl('/production/create-program');
    }
  }

  patchUpdateDetails() {
    this.form.get('shadeId')?.setValue(this.updateProgramDetails.shadeId);
    this.form.get('shadeName')?.setValue(this.updateProgramDetails.shadeName);
    this.form.get('shadeName')?.disable();
    this.form.get('blendId')?.setValue(this.updateProgramDetails.blendId);
    this.form.get('blendName')?.setValue(this.updateProgramDetails.blendName);
    this.form.get('blendName')?.disable();
    const programDate = this.updateProgramDetails.programDate.split('/');
    this.form
      .get('programDate')
      ?.setValue(
        new Date(
          `${programDate[1]}/${programDate[0]}/${programDate[2]}`
        ).toISOString()
      );
    this.form.get('programDate')?.disable();
    this.form.get('remarks')?.setValue(this.updateProgramDetails.remarks);

    this.dataSource = this.updateProgramDetails.yarnCounts?.map(
      (data, index) => ({ ...data, orderNo: index })
    );
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
        counts: this.dataSource,
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
      const yarnCounts: ConversionYarn[] = this.dataSource.map((data) => ({
        programId: 0,
        conversionYarnId: 0,
        countsId: data.countsId,
        counts: data.counts,
        programQuantity: +data.programQuantity,
        productionQuantity: 0,
      }));
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
        isMixed: false,
        closedByUserId: 0,
        createdByUserId: this.appSharedService.userId,
        yarnCounts,
        mixingDetails: [],
      };
      this.conversionService.createProgram(program).subscribe({
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

  updateProgram() {
    if (!this.hasError()) {
      const program: ConversionProgram = {
        ...this.updateProgramDetails,
        ...this.form.value,
        yarnCounts: this.dataSource.map((data) => ({
          conversionYarnId: data.conversionYarnId || 0,
          countsId: data.countsId,
          counts: data.counts,
          programQuantity: +data.programQuantity,
          productionQuantity: data.productionQuantity || 0,
          programId: this.updateProgramDetails.programId,
        })),
      };
      this.conversionService.updateProgram(program).subscribe({
        next: (response) => {
          this.notificationService
            .success(response)
            .afterClosed()
            .subscribe(() => this.goToSearch());
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      });
    }
  }

  resetData() {
    this.form.reset();
    this.dataSource = [];
  }

  getTotalProgramQty() {
    return this.dataSource
      .map((data: ConversionYarn) => +data.programQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalProductionQty() {
    return this.dataSource
      .map((data: ConversionYarn) => +data.productionQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  goToSearch() {
    this.clearSearch = false;
    this.router.navigateByUrl('/production/search-program');
  }
}
