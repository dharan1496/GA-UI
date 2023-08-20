import { Component, ViewChild } from '@angular/core';
import { ChooseProgramForEntryComponent } from '../choose-program-for-entry/choose-program-for-entry.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { ConversionYarn } from 'src/app/models/conversionYarn';
import { ProgramForProductionEntry } from 'src/app/models/programForProductionEntry';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotifyType } from 'src/app/models/notify';
import { AddWasteEntryComponent } from './add-waste-entry/add-waste-entry.component';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { ProgramWaste } from 'src/app/models/programWaste';

@Component({
  selector: 'app-waste-entry',
  templateUrl: './waste-entry.component.html',
  styleUrls: ['./waste-entry.component.scss'],
})
export class WasteEntryComponent {
  programDetails: ProgramForProductionEntry | undefined;
  yarnDetails: ConversionYarn[] = [];
  entryDetails: any[] = [];
  yarnDisplayedColumns = ['yarnCount', 'kgs', 'prodQty'];
  entryDisplayedColumns = ['wasteCategory', 'quantity', 'action'];
  @ViewChild('entry') table!: MatTable<any>;
  subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    public yarnService: YarnService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  chooseProgram() {
    this.dialog
      .open(ChooseProgramForEntryComponent, { minWidth: '75vw' })
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
      const wasteEntry: ProgramWaste[] = this.entryDetails.map((data) => ({
        wasteCategoryId: +data.wasteCategoryId,
        wasteCategoryName: data.wasteCategoryName,
        wasteQuantity: data.wasteQuantity,
      }));
      this.subscription.add(
        this.yarnService
          .conversionWaste(wasteEntry, this.programDetails?.programId || 0)
          .subscribe({
            next: (response) => {
              this.notificationService.success(response);
              this.resetData();
            },
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
    if (!this.programDetails) {
      this.notificationService.notify(
        'Please choose the program to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.entryDetails.length === 0) {
      this.notificationService.notify(
        'Please add the waste category entry to proceed',
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
  }

  addEntry(): void {
    this.dialog
      .open(AddWasteEntryComponent, {
        data: {
          entryNo: this.entryDetails.length + 1,
          entries: this.entryDetails.map((data) => data.wasteCategoryName),
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
    this.dialog
      .open(AddWasteEntryComponent, {
        data: {
          selectedRow,
          entries: this.entryDetails.map((data) => data.wasteCategoryName),
        },
      })
      .afterClosed()
      .subscribe((result) => {
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

  getTotalQty(): number {
    return this.entryDetails.reduce(
      (acc, curr) => acc + +curr.wasteQuantity,
      0
    );
  }
}
