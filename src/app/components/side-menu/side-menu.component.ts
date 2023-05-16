import { Component } from '@angular/core';
import { NavigationService } from '../../shared/navigation.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  constructor(public navigationService: NavigationService) {}

  onHome() {
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }
}
