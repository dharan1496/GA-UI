import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Constants } from 'src/app/constants/constants';
import { Months } from 'src/app/constants/months';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent {
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: Months,
    datasets: [
      {
        data: [10, 5, 8, 12, 18, 6, 22, 2, 20, 15, 20, 23],
        label: 'Fibre',
        backgroundColor: 'rgb(255, 173, 51)',
        barPercentage: 0.75,
      },
    ],
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = PURCHASE;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
  }
}
