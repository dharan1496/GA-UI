import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private decimalPipe: DecimalPipe) {}

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
