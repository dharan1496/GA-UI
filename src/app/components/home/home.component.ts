import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = null;
    this.navigationService.isSidenavOpened = false;
    this.navigationService.removeFocus();
  }
}
