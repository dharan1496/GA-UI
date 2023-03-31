import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { TimeoutService } from 'src/app/shared/timeout.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {
  @Input() sidenav!: MatSidenav;

  constructor(
    private router: Router,
    public navigationService: NavigationService,
    public appSharedService: AppSharedService,
    private timeoutService: TimeoutService,
  ) {}

  toggleSidenav() {
    this.navigationService.isSidenavOpened = !this.navigationService.isSidenavOpened;
    this.sidenav.toggle();
  }

  selectSection(section: string) {
    // Temp - start, needed until production and sales component add
    if (section !== Constants.PURCHASES) {
      this.navigationService.menu = null
    }
    this.navigationService.setFocus(section);
    // Temp - end
    this.router.navigateByUrl(section);
  }

  onLogout() {
    this.timeoutService.inSession = false;
    this.navigationService.logout(this.timeoutService.interval);
  }

}
