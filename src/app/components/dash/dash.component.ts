import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent {
  fibrePieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  fibrePieChartLabels = ['Pending', 'Delivered'];
  fibrePieChartDatasets = [
    {
      data: [12, 88],
    },
  ];

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }

  navigateToFibre(event: any) {
    this.fibrePieChartLabels[event.active[0]?.index];
    this.router.navigateByUrl('/purchases/fibre');
  }
}
