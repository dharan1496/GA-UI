import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../shared/navigation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private navigationService: NavigationService) {
    this.navigationService.isSidenavOpened = false;
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }

}
