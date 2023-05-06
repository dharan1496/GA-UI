import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { YarnService } from 'src/app/services/yarn.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ChooseProgramComponent } from './choose-program/choose-program.component';
import { FibreStockComponent } from './fibre-stock/fibre-stock.component';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-mixing',
  templateUrl: './mixing.component.html',
  styleUrls: ['./mixing.component.scss'],
})
export class MixingComponent {
  yarnDetails = [];
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
    'issuedQty',
    'percentUsed',
  ];
  @ViewChild(MatTable) table!: MatTable<any>;

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
      .open(ChooseProgramComponent, { minWidth: 1000 })
      .afterClosed()
      .subscribe((program) => {
        if (program) {
          //
        }
      });
  }

  fibreStock() {
    this.dialog
      .open(FibreStockComponent, { minWidth: 1000 })
      .afterClosed()
      .subscribe(() => {
        // temps
        this.mixingDetails = [
          {
            receivedDCNo: '12345',
            fibreCategory: 'Polyster',
            fibre: 'test',
            fibreShade: 'blue',
            lot: 'E#',
            bales: '',
            issuedQty: '',
            stockQty: 234,
          } as never,
          {
            receivedDCNo: '12345',
            fibreCategory: 'Polyster',
            fibre: 'test',
            fibreShade: 'blue',
            lot: 'E#',
            bales: '',
            issuedQty: '',
            stockQty: 234,
          } as never,
        ];
        this.table.renderRows();
      });
  }

  submit() {
    //
  }

  resetData() {
    this.yarnDetails = [];
    this.mixingDetails = [];
  }

  getPercentUsed(element: any): number {
    const totalIssuedQty = this.getTotalIssuedQty();
    let percent = 0;
    if (element?.issuedQty) {
      percent = (+element?.issuedQty / totalIssuedQty) * 100;
    }
    element.percentUsed = percent;
    return percent;
  }

  getTotalIssuedQty(): number {
    return this.mixingDetails.reduce(
      (acc, curr) => acc + +curr['issuedQty'],
      0
    );
  }

  getTotalBale(): number {
    return this.mixingDetails.reduce((acc, curr) => acc + +curr['bales'], 0);
  }

  getTotalPercentage(): number {
    return this.mixingDetails.reduce(
      (acc, curr) => acc + +curr['percentUsed'],
      0
    );
  }
}
