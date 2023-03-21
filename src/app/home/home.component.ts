import { Component } from '@angular/core';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private navigationService: NavigationService) {
    this.navigationService.isSidenavOpened = false;
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }

}
