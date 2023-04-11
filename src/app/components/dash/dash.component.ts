import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent {
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }
}
