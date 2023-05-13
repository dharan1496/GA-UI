import { Component, ViewChild } from '@angular/core';
import { ChooseProgramForEntryComponent } from '../choose-program-for-entry/choose-program-for-entry.component';
import { DatePipe } from '@angular/common';
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
      //
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
        data: this.entryDetails.length + 1,
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
    //
  }

  removeEntry(element: any) {
    //
  }
}
