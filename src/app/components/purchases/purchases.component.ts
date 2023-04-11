import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Constants } from 'src/app/constants/constants';
import { Months } from 'src/app/constants/months';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  chart: any;

  constructor(
    private navigationService: NavigationService,
    private currencyPipe: CurrencyPipe
  ) {
    this.navigationService.menu = PURCHASE;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const topLabels = {
      id: 'topLabels',
      afterDatasetsDraw: (chart: Chart) => {
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
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.textAlign = 'center';
          ctx.fillText(
            sum,
            x.getPixelForValue(index),
            chart.getDatasetMeta(1).data[index]?.y - 15
          );
        });
      },
    };

    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: Months,
        datasets: [
          {
            data: [10, 5, 8, 12, 18, 6, 22, 2, 20, 15, 20, 23],
            label: 'Fibre PO Received',
            barPercentage: 0.75,
            backgroundColor: `rgba(88, 235, 52, 0.7)`,
          },
          {
            data: ['', '', '', '', 7, 2, 5, 6, 8, 5, 8, 2],
            label: 'Fibre PO Pending',
            barPercentage: 0.75,
            backgroundColor: `rgba(235, 211, 52, 0.75)`,
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
              text: 'Month (2023)',
              padding: 20,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grace: 5,
            title: {
              display: true,
              text: 'PO Counts',
              padding: 20,
            },
          },
        },
      },
      plugins: [ChartDataLabels, topLabels],
    });
  }
}
