import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { ConversionYarn } from 'src/app/models/conversionYarn';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ChooseProgramForEntryComponent } from '../choose-program-for-entry/choose-program-for-entry.component';
import { ProgramForProductionEntry } from 'src/app/models/programForProductionEntry';
import { AddProductionEntryComponent } from './add-production-entry/add-production-entry.component';
import { NotifyType } from 'src/app/models/notify';
import { ProductionEntry } from 'src/app/models/productionEntry';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-production-entry',
  templateUrl: './production-entry.component.html',
  styleUrls: ['./production-entry.component.scss'],
})
export class ProductionEntryComponent {
  programDetails: ProgramForProductionEntry | undefined;
  yarnDetails: ConversionYarn[] = [];
  entryDetails: any[] = [];
  yarnDisplayedColumns = ['yarnCount', 'kgs', 'prodQty'];
  entryDisplayedColumns = ['counts', 'lot', 'prodQty', 'winding', 'action'];
  @ViewChild('entry') table!: MatTable<any>;
  subscription = new Subscription();
  productionDate = new FormControl('', Validators.required);

  constructor(
    private navigationService: NavigationService,
    public yarnService: YarnService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private datePipe: DatePipe
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  chooseProgram() {
    this.dialog
      .open(ChooseProgramForEntryComponent, { minWidth: 1000 })
      .afterClosed()
      .subscribe((program: ProgramForProductionEntry) => {
        if (program) {
          this.programDetails = program;
          this.yarnService
            .getProgramDetailsById(program.programId)
            .subscribe((data) => {
              this.yarnDetails = data.yarnCounts;
            });
        }
      });
  }

  submit() {
    if (!this.hasError()) {
      const entry: ProductionEntry = {
        programId: this.programDetails?.programId || 0,
        mixingId: this.programDetails?.mixingId || 0,
        productionDate:
          this.datePipe.transform(this.productionDate.value, 'dd/MM/yyyy') ||
          '',
        createdByUserId: 0,
        yarnDetails: this.entryDetails.map((data) => ({
          countsId: data.countsId,
          lot: data.lot,
          productionQuantity: data.productionQty,
          isWinded: data.winding === 'Yes',
        })),
      };
      this.yarnService.conversionProduction(entry).subscribe({
        next: (response) => {
          this.notificationService.success(response);
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

  hasError(): boolean {
    if (!this.programDetails) {
      this.notificationService.notify(
        'Please choose the program to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.productionDate.invalid) {
      this.productionDate.markAsTouched();
      this.notificationService.notify(
        'Please choose the Production Date to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.entryDetails.length === 0) {
      this.notificationService.notify(
        'Please add the entry to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.programDetails = undefined;
    this.yarnDetails = [];
    this.entryDetails = [];
    this.productionDate.reset();
  }

  addEntry(): void {
    this.dialog
      .open(AddProductionEntryComponent, {
        data: {
          entryNo: this.entryDetails.length + 1,
          countsList: this.yarnDetails.map((data) => ({
            counts: data.counts,
            countsId: data.countsId,
          })),
          alreadyExist: this.entryDetails.map((data) => data.counts),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.entryDetails.push(result);
          this.table.renderRows();
        }
      });
  }

  updateEntry(selectedRow: any) {
    const dialogRef = this.dialog.open(AddProductionEntryComponent, {
      data: {
        selectedRow,
        countsList: this.yarnDetails.map((data) => ({
          counts: data.counts,
          countsId: data.countsId,
        })),
        alreadyExist: this.entryDetails.map((data) => data.counts),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.entryDetails.forEach((data: any, index: number) => {
          if (data?.entryNo === result?.entryNo) {
            this.entryDetails[index] = result;
          }
        });
      }
      this.table.renderRows();
    });
  }

  removeEntry(element: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.entryDetails = this.entryDetails.filter(
            (data) => data !== element
          );
        }
      });
  }
}
