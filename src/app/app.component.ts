import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isShowing!: boolean;

  toggleSidenav() {
    this.isShowing = !this.isShowing;
  }

  callMethods() {
      this.toggleSidenav();
  }

}
