import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { YarnService } from 'src/app/services/yarn.service';
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
import { BlendMismatchComponent } from './blend-mismatch/blend-mismatch.component';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';

@Component({
  selector: 'app-mixing',
  templateUrl: './mixing.component.html',
  styleUrls: ['./mixing.component.scss'],
})
export class MixingComponent {
  programDetails: ConversionProgram | undefined;
  yarnDetails: ConversionYarn[] = [];
  mixingDetails = [];
  yarnDisplayedColumns = ['yarnCount', 'kgs'];
  mixingDisplayedColumns = [
    'receivedDCNo',
    'fibreCategory',
    'fibre',
    'fibreShade',
    'lot',
    'stockQty',
    'bales',
    'issueQty',
    'percentUsed',
    'action',
  ];
  @ViewChild(MatTable) table!: MatTable<any>;
  mixingDate = new FormControl('', Validators.required);
  subscription = new Subscription();
  mixedBlend = '';

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
      .open(ChooseProgramComponent, { minWidth: '75vw' })
      .afterClosed()
      .subscribe((programId: number) => {
        if (programId) {
          this.yarnService
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
        data: this.programDetails?.programId,
      })
      .afterClosed()
      .subscribe((stock) => {
        if (stock) {
          this.mixingDetails = stock;
          this.table.renderRows();
          this.getMixedBlend();
        }
      });
  }

  submit() {
    if (!this.hasError()) {
      this.checkBlend();
    }
  }

  checkBlend() {
    const mixedBlend = this.getMixedBlend();
    if (mixedBlend !== this.programDetails?.blendName) {
      this.dialog
        .open(BlendMismatchComponent, {
          data: { expected: this.programDetails?.blendName, mixed: mixedBlend },
        })
        .afterClosed()
        .subscribe((response) => response && this.issueFibre());
      return;
    }
    this.issueFibre();
  }

  getMixedBlend(): string {
    const mixingBlend: string[] = [];
    const addedStockType = [
      ...new Set(
        this.mixingDetails
          .sort((a, b) => a['fibreCategoryId'] - b['fibreCategoryId'])
          .map((data) => data['fibreCategoryName'])
      ),
    ];
    addedStockType.forEach((fibreName: string) => {
      mixingBlend.push(
        fibreName[0] +
          Math.round(
            this.mixingDetails
              .filter((data) => data['fibreCategoryName'] === fibreName)
              .map((data) => this.getPercentUsed(data))
              .reduce((acc, curr) => acc + curr, 0) || 0
          )
      );
    });
    this.mixedBlend = mixingBlend.join(':');
    return this.mixedBlend;
  }

  issueFibre() {
    const fibres: FibreIssued[] = this.mixingDetails.map((data: any) => {
      return {
        receivedDtsId: data?.receivedDtsId,
        fibreTypeId: data?.fibreTypeId,
        issueQuantity: +data?.issueQuantity,
        shadeId: data?.shadeId,
        lot: data?.lot,
        productionWasteDtsId: data?.productionWasteDtsId,
      };
    });
    const fibreMixing: FibreMixing = {
      programId: this.programDetails?.programId || 0,
      mixingDate:
        this.datePipe.transform(this.mixingDate.value, 'dd/MM/yyyy') || '',
      issuedByUseId: 0,
      fibres,
    };
    this.yarnService.issueFibreForMixing(fibreMixing).subscribe({
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
    if (document.getElementsByClassName('bales-border-error').length > 0) {
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
    if (
      !this.mixingDetails.every(
        (data) => data['bales'] && data['issueQuantity']
      )
    ) {
      this.notificationService.notify(
        'Please enter the Bales & IssueQuantity',
        NotifyType.ERROR
      );
      return true;
    }
    return false;
  }

  resetData() {
    this.programDetails = undefined;
    this.yarnDetails = [];
    this.mixingDetails = [];
    this.mixingDate.reset();
  }

  removeStock(element: any) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.mixingDetails = this.mixingDetails.filter(
            (data) => data !== element
          );
          this.getMixedBlend();
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
