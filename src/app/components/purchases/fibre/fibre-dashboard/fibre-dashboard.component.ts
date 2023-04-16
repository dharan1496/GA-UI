import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DecimalPipe } from '@angular/common';
import { FibreService } from 'src/app/services/fibre.service';
import { FibreGraph } from 'src/app/models/fibreGraph';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-fibre-dashboard',
  templateUrl: './fibre-dashboard.component.html',
  styleUrls: ['./fibre-dashboard.component.scss'],
})
export class FibreDashboardComponent implements OnInit, OnDestroy {
  chart: any;
  subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private decimalPipe: DecimalPipe,
    private fibreService: FibreService,
    private notificationService: NotificationService
  ) {
    this.navigationService.menu = PURCHASE;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
  }

  ngOnInit() {
    this.subscription.add(
      this.fibreService.getFibreGraphData().subscribe(
        (data: FibreGraph[]) => this.createChart(data),
        (error) => this.handleError(error)
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleError(error: any) {
    const emptyData = Array(12).fill('');
    this.notificationService.error(error?.error || error?.message);
    this.createChart(emptyData);
  }

  createChart(data: FibreGraph[]) {
    const receivedQty = data.map((data) => data.receivedQty || '');
    const pendingQty = data.map(
      (data) => data.poQuantity - data.receivedQty || ''
    );
    const months = data.map((data) => data.poMonthYear);
    this.chart = new Chart('MyChart', {
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
            grace: 10,
            title: {
              display: true,
              text: 'PO Qty',
              padding: 20,
            },
          },
        },
      },
      plugins: [ChartDataLabels, this.getTopLabels()],
    });
  }

  getTopLabels() {
    return {
      id: 'topLabels',
      afterDatasetsDraw: (chart: Chart) => {
        if (chart.isDatasetVisible(0) && chart.isDatasetVisible(1)) {
          const {
            ctx,
            scales: { x },
          } = chart;
          chart.data.datasets[0].data.forEach((datapoint, index) => {
            const datasetArray: any[] = [];
            chart.data.datasets.forEach((dataset) =>
              datasetArray.push(dataset.data[index])
            );

            const sum = datasetArray.reduce(
              (total: number, values: number) => total + values,
              0
            );

            ctx.font = '14px sans-serif';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.textAlign = 'center';
            ctx.fillText(
              sum ? `${this.decimalPipe.transform(sum, '1.0-3')} kg` : '',
              x.getPixelForValue(index),
              chart.getDatasetMeta(1).data[index]?.y - 25
            );
          });
        }
      },
    };
  }
}
