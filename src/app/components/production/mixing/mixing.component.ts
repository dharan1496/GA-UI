import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ChooseProgramComponent } from './choose-program/choose-program.component';
import { SelectFibreStockComponent } from './select-fibre-stock/select-fibre-stock.component';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { MatTable } from '@angular/material/table';
import { NotifyType } from 'src/app/models/notify';
import { ConversionYarn } from 'src/app/models/conversionYarn';
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { FormControl, Validators } from '@angular/forms';
import { FibreMixing } from 'src/app/models/fibreMixing';
import { DatePipe } from '@angular/common';
import { FibreIssued } from 'src/app/models/fibreIssued';
import { Subscription } from 'rxjs';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { ConversionService } from 'src/app/services/conversion.service';
import { WasteStockDialogComponent } from '../../sales/waste-order-delivery/waste-stock-dialog/waste-stock-dialog.component';
import { Router } from '@angular/router';
import { ProgramFibresMixed } from 'src/app/models/programFibresMixed';

@Component({
  selector: 'app-mixing',
  templateUrl: './mixing.component.html',
  styleUrls: ['./mixing.component.scss'],
})
export class MixingComponent implements OnInit, OnDestroy {
  programDetails: ConversionProgram | undefined;
  yarnDetails: ConversionYarn[] = [];
  mixingDetails = [];
  yarnDisplayedColumns = ['yarnCount', 'kgs'];
  mixingDisplayedColumns = [
    'receivedDCNo',
    'fibreCategory',
    'wasteCategory',
    'fibre',
    'fibreShade',
    'lot',
    'stockQty',
    'issueQty',
    'percentUsed',
    'action',
  ];
  updateColumns = [
    'receivedDCNo',
    'fibreCategory',
    'wasteCategory',
    'fibre',
    'fibreShade',
    'lot',
    'issueQty',
    'percentUsed',
    'action',
  ];
  @ViewChild('mixing') table!: MatTable<any>;
  mixingDate = new FormControl('', Validators.required);
  subscription = new Subscription();
  mixedBlend = '';
  fibreStocks = [];
  wasteStocks = [];
  updateMixing = false;
  mixingId!: number;

  constructor(
    private navigationService: NavigationService,
    public conversionService: ConversionService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    if (this.router.url.includes('update-mixing')) {
      this.updateMixing = true;
      this.checkForUpdate();
    } else {
      this.updateMixing = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.updateMixing = false;
  }

  checkForUpdate() {
    const program = sessionStorage.getItem('program');
    const mixing = sessionStorage.getItem('mixingDetails');
    if (program && mixing) {
      this.programDetails = JSON.parse(program) as ConversionProgram;
      const mixingData = JSON.parse(mixing) as ProgramFibresMixed[];
      this.mixingId = mixingData[0]?.mixingId;
      const data = mixingData[0]?.mixingDate?.split('/');
      this.mixingDate.setValue(
        new Date(`${data[1]}/${data[0]}/${data[2]}`).toISOString()
      );
      this.mixingDate.disable();
      this.yarnDetails = this.programDetails?.yarnCounts || [];
      this.mixingDetails = mixingData?.map((data) => ({
        ...data,
        issueQuantity: data?.issuedQuantity,
        fibreType: data?.fiberType,
        shadeName: data?.fiberShade,
        fibreCategoryName: data?.fiberCategory,
        fibreTypeId: data?.fiberTypeId,
        shadeId: data?.fiberShadeId,
      })) as never[];
      sessionStorage.clear();
    } else {
      this.router.navigateByUrl('/production/mixing');
    }
  }

  getProgramMixingDetails(programID: number) {
    this.subscription.add(
      this.conversionService.getProgramMixingDetails(programID).subscribe({
        next: (response) => {
          this.mixingDetails = response?.map((data) => ({
            ...data,
            issueQuantity: data?.issuedQuantity,
            fibreType: data?.fiberType,
            shadeName: data?.fiberShade,
            fibreCategoryName: data?.fiberCategory,
          })) as never[];
          this.table.renderRows();
        },
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  chooseProgram() {
    this.dialog
      .open(ChooseProgramComponent, { minWidth: '75vw' })
      .afterClosed()
      .subscribe((programId: number) => {
        if (programId) {
          this.conversionService
            .getProgramDetailsById(programId)
            .subscribe((data) => {
              this.programDetails = data;
              this.yarnDetails = data.yarnCounts;
            });
        }
      });
  }

  fibreStock() {
    this.dialog
      .open(SelectFibreStockComponent, {
        minWidth: '70vw',
        data: {
          programId: this.programDetails?.programId,
          existingStocks: this.fibreStocks || [],
        },
      })
      .afterClosed()
      .subscribe((stock) => {
        if (stock) {
          this.fibreStocks = stock;
          this.mixingDetails = [...this.wasteStocks, ...this.fibreStocks];
          this.table.renderRows();
        }
      });
  }

  wasteStock() {
    this.dialog
      .open(WasteStockDialogComponent, {
        data: {
          existingStocks: this.wasteStocks || [],
        },
        minWidth: '60vw',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.wasteStocks = result;
          this.mixingDetails = [
            ...(this.fibreStocks || []),
            ...this.wasteStocks,
          ];
          this.table.renderRows();
        }
      });
  }

  submit() {
    if (!this.hasError()) {
      const fibres: FibreIssued[] = this.mixingDetails.map((data: any) => {
        return {
          receivedDtsId: data?.receivedDtsId || 0,
          fibreTypeId: data?.fibreTypeId || 0,
          issueQuantity: +data?.issueQuantity || +data?.stockQuantity,
          shadeId: data?.shadeId || data?.mixedForShadeId || 0,
          lot: data?.lot || null,
          productionWasteDtsId: data?.productionWasteDtsId || 0,
          fibreMixingDtsId: 0,
        };
      });
      const fibreMixing: FibreMixing = {
        programId: this.programDetails?.programId || 0,
        mixingDate:
          this.datePipe.transform(this.mixingDate.value, 'dd/MM/yyyy') || '',
        issuedByUseId: 0,
        fibres,
      };
      this.conversionService.issueFibreForMixing(fibreMixing).subscribe({
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
        'Please choose the Program to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.mixingDate.invalid) {
      this.mixingDate.markAsTouched();
      this.notificationService.notify(
        'Please choose the Mixing Date to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (this.mixingDetails.length === 0) {
      this.notificationService.notify(
        'Please choose the Fibre Stock to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (
      !this.updateMixing &&
      document.getElementsByClassName('bales-border-error').length > 0
    ) {
      this.notificationService.notify(
        'Please correct the Bales to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (document.getElementsByClassName('issue-qty-border-error').length > 0) {
      this.notificationService.notify(
        'Please correct the IssueQty to proceed',
        NotifyType.ERROR
      );
      return true;
    }
    if (!this.mixingDetails.every((data) => data['issueQuantity'])) {
      this.notificationService.notify(
        'Please enter the IssueQuantity',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  update() {
    if (!this.hasError() && this.programDetails) {
      const fibres: FibreIssued[] = this.mixingDetails.map((data: any) => {
        return {
          receivedDtsId: data?.receivedDtsId || 0,
          fibreTypeId: data?.fibreTypeId || 0,
          issueQuantity: +data?.issueQuantity || +data?.stockQuantity,
          shadeId: data?.shadeId || data?.mixedForShadeId || 0,
          lot: data?.lot || null,
          productionWasteDtsId: data?.productionWasteDtsId || 0,
          fibreMixingDtsId: data?.fibreMixingDtsId,
        };
      });
      this.conversionService
        .updateMixingDetails(this.mixingId, fibres)
        .subscribe({
          next: (response) => {
            this.notificationService.success(response);
            this.router.navigateByUrl('/production/search-program');
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
    this.programDetails = undefined;
    this.yarnDetails = [];
    this.mixingDetails = [];
    this.fibreStocks = [];
    this.wasteStocks = [];
    this.mixingDate.reset();
  }

  removeStock(element: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.fibreStocks = this.fibreStocks.filter(
            (data) => data !== element
          );
          this.wasteStocks = this.wasteStocks.filter(
            (data) => data !== element
          );
          this.mixingDetails = this.mixingDetails.filter(
            (data) => data !== element
          );
        }
      });
  }

  getPercentUsed(element: any): number {
    const totalIssueQty = this.getTotalIssueQty();
    let percent = 0;
    if (+element?.issueQuantity) {
      percent = (+element?.issueQuantity / totalIssueQty) * 100;
    }
    element.percentUsed = percent;
    return percent;
  }

  getTotalIssueQty(): number {
    return this.mixingDetails.reduce(
      (acc, curr) => acc + (+curr['issueQuantity'] || 0),
      0
    );
  }

  getTotalBales(): number {
    return this.mixingDetails.reduce(
      (acc, curr) => acc + (+curr['bales'] || 0),
      0
    );
  }

  getTotalPercentage(): number {
    return this.mixingDetails.reduce(
      (acc, curr) => acc + (+curr['percentUsed'] || 0),
      0
    );
  }

  checkIssueQty(element: any): boolean {
    return element.issueQuantity > element.stock;
  }

  checkZeroInIssueQty(element: any): boolean {
    return element.issueQuantity == 0;
  }

  checkZeroInBales(element: any): boolean {
    return element.bales == 0;
  }
}
