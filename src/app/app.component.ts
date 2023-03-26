import { Component } from '@angular/core';
import { NavigationService } from './shared/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isShowing!: boolean;

  constructor(public navigationService: NavigationService) {}

  toggleSidenav() {
    this.isShowing = !this.isShowing;
  }

  callMethods() {
    this.toggleSidenav();
  }

}
