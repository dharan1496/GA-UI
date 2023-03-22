import { Component } from '@angular/core';
import { NavigationService } from './shared/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public navigationService: NavigationService) {}

  isShowing!: boolean;

  toggleSidenav() {
    this.isShowing = !this.isShowing;
  }

  callMethods() {
      this.toggleSidenav();
  }

}
