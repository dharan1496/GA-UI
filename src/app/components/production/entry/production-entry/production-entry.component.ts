import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { ConversionYarn } from 'src/app/models/conversionYarn';
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
import { ConversionService } from 'src/app/services/conversion.service';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { ProductionYarn } from 'src/app/models/productionYarn';

@Component({
  selector: 'app-production-entry',
  templateUrl: './production-entry.component.html',
  styleUrls: ['./production-entry.component.scss'],
})
export class ProductionEntryComponent implements OnInit, OnDestroy {
  programDetails: ProgramForProductionEntry | undefined;
  yarnDetails: ConversionYarn[] = [];
  entryDetails: any[] = [];
  yarnDisplayedColumns = ['yarnCount', 'kgs', 'prodQty'];
  entryDisplayedColumns = ['counts', 'lot', 'prodQty', 'winding', 'action'];
  @ViewChild('entry') table!: MatTable<any>;
  subscription = new Subscription();
  productionDate = new FormControl('', Validators.required);
  isUpdate = false;
  countsList!: YarnCounts[];
  updateProductionDetails!: ProductionEntry;
  clearSearch = true;

  constructor(
    private navigationService: NavigationService,
    public conversionService: ConversionService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private datePipe: DatePipe,
    private router: Router,
    private masterService: MasterService
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    this.subscription.add(
      this.masterService.getYarnCounts().subscribe({
        next: (data) => {
          this.countsList = data;
          if (this.router.url.includes('update-production-entry')) {
            this.checkForUpdate();
          }
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  ngOnDestroy() {
    this.clearSearch && sessionStorage.removeItem('search-production');
    this.subscription.unsubscribe();
  }

  checkForUpdate() {
    const production = sessionStorage.getItem('production');
    if (production) {
      this.isUpdate = true;
      const productionEntry: ProductionEntry = JSON.parse(production);
      this.updateProductionDetails = productionEntry;
      this.programDetails = productionEntry as any;
      this.productionDate.setValue(
        new Date(productionEntry.productionDate).toISOString()
      );
      this.productionDate.disable();
      this.entryDetails = productionEntry.yarnDetails?.map((data, index) => ({
        entryNo: index,
        countsId: data.countsId,
        counts: this.countsList.find(
          (counts) => counts.countsId === data.countsId
        )?.counts,
        lot: data.lot,
        winding: data.isWinded ? 'Yes' : 'No',
        productionQty: data.productionQuantity,
      }));
      sessionStorage.removeItem('production');
    } else {
      this.isUpdate = false;
      this.router.navigateByUrl('/production/production-entry');
    }
  }

  chooseProgram() {
    this.dialog
      .open(ChooseProgramForEntryComponent, { minWidth: '75vw' })
      .afterClosed()
      .subscribe((program: ProgramForProductionEntry) => {
        if (program) {
          this.programDetails = program;
          this.conversionService
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
        productionId: 0,
        programNo: this.programDetails?.programNo || '',
        programDate: this.programDetails?.programDate || '',
        shadeId: this.programDetails?.shadeId || 0,
        shadeName: this.programDetails?.shadeName || '',
        blendId: this.programDetails?.blendId || 0,
        blendName: this.programDetails?.blendName || '',
        yarnDetails: this.entryDetails.map((data) => ({
          countsId: data.countsId,
          lot: data.lot,
          productionQuantity: data.productionQty,
          isWinded: data.winding === 'Yes',
          deliveredQuantity: 0,
          productionDtsId: 0,
        })),
      };
      this.conversionService.conversionProduction(entry).subscribe({
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

  update() {
    if (!this.hasError()) {
      const entry: ProductionYarn[] = this.entryDetails.map((data, index) => ({
        countsId: data.countsId,
        lot: data.lot,
        productionQuantity: data.productionQty,
        isWinded: data.winding === 'Yes',
        productionDtsId:
          this.updateProductionDetails.yarnDetails[index]?.productionDtsId,
        deliveredQuantity:
          this.updateProductionDetails.yarnDetails[index]?.deliveredQuantity,
      }));
      this.conversionService
        .updateProduction(this.updateProductionDetails.productionId, entry)
        .subscribe({
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
          countsList: this.isUpdate
            ? this.updateProductionDetails.yarnDetails.map((data) => ({
                counts: this.countsList.find(
                  (counts) => counts.countsId === data.countsId
                )?.counts,
                countsId: data.countsId,
              }))
            : this.yarnDetails.map((data) => ({
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
        countsList: this.isUpdate
          ? this.updateProductionDetails.yarnDetails.map((data) => ({
              counts: this.countsList.find(
                (counts) => counts.countsId === data.countsId
              )?.counts,
              countsId: data.countsId,
            }))
          : this.yarnDetails.map((data) => ({
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

  goToSearch() {
    this.clearSearch = false;
    this.router.navigateByUrl('/production/search-production');
  }
}
