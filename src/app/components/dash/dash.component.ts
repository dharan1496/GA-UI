import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent {
  cards = [
    { title: 'Purchases', cols: 1, rows: 1 },
    { title: 'Production', cols: 1, rows: 1 },
    { title: 'Sales', cols: 1, rows: 1 },
  ];

  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }
}
