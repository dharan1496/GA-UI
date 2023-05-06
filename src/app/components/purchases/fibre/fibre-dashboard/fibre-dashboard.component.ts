import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FibreService } from 'src/app/services/fibre.service';
import { FibreGraph } from 'src/app/models/fibreGraph';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-fibre-dashboard',
  templateUrl: './fibre-dashboard.component.html',
  styleUrls: ['./fibre-dashboard.component.scss'],
})
export class FibreDashboardComponent implements OnInit, OnDestroy {
  chart: any;
  subscription = new Subscription();
  grace = 10;

  constructor(
    private navigationService: NavigationService,
    private fibreService: FibreService,
    private notificationService: NotificationService,
    private chartService: ChartService
  ) {
    this.navigationService.menu = PURCHASE;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
  }

  ngOnInit() {
    this.subscription.add(
      this.fibreService.getFibreGraphData().subscribe({
        next: (data: FibreGraph[]) => this.createChart(data),
        error: (error) => this.handleError(error),
      })
    );
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
    const receivedQty = data.map((data) => data.receivedQty || '');
    const pendingQty = data.map(
      (data) => data.poQuantity - data.receivedQty || ''
    );
    this.grace = this.getGrace(data);
    const months = data.map((data) => data.poMonthYear);
    this.chart = new Chart('poChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            data: receivedQty,
            label: 'Fibre Qty Received',
            backgroundColor: `rgba(88, 235, 52, 0.7)`,
            stack: 'fibre',
          },
          {
            data: pendingQty,
            label: 'Fibre Qty Pending',
            backgroundColor: `rgba(235, 211, 52, 0.75)`,
            stack: 'fibre',
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
              text: 'PO Qty',
              padding: 20,
            },
          },
        },
      },
      plugins: [ChartDataLabels, this.chartService.getTopLabels()],
    });
  }
}
