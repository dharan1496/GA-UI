import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { FibreGraph } from 'src/app/models/fibreGraph';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-production-dashboard',
  templateUrl: './production-dashboard.component.html',
  styleUrls: ['./production-dashboard.component.scss'],
})
export class ProductionDashboardComponent implements OnInit, OnDestroy {
  chart: any;
  subscription = new Subscription();
  grace = 10;

  constructor(
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    private chartService: ChartService
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    // temp
    this.createChart(Array(12).fill(''));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleError(error: any) {
    const emptyData = Array(12).fill('');
    this.notificationService.error(
      typeof error?.error === 'string' ? error?.error : error?.message
    );
    this.createChart(emptyData);
  }

  getGrace(data: FibreGraph[]) {
    const max = Math.max(...data.map((data) => data.poQuantity));
    if (max > 10000) return 10000;
    if (max > 1000) return 1000;
    if (max > 100) return 100;
    return 10;
  }

  createChart(data: FibreGraph[]) {
    const completedQty = data.map(() => '');
    const pendingQty = data.map(() => '');
    this.grace = this.getGrace(data);
    // temp
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.chart = new Chart('productionChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            data: completedQty,
            label: 'Completed',
            backgroundColor: `rgba(88, 235, 52, 0.7)`,
            stack: 'yarn',
          },
          {
            data: pendingQty,
            label: 'Pending',
            backgroundColor: `rgba(235, 211, 52, 0.75)`,
            stack: 'yarn',
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Month & year',
              padding: 20,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grace: this.grace,
            title: {
              display: true,
              text: 'Qty',
              padding: 20,
            },
          },
        },
      },
      plugins: [ChartDataLabels, this.chartService.getTopLabels()],
    });
  }
}
