import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Constants } from 'src/app/constants/constants';
import { PARTY } from 'src/app/constants/party-menu-values.const';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { TimeoutService } from 'src/app/shared/timeout.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent {
  @Input() sidenav!: MatSidenav;

  constructor(
    public navigationService: NavigationService,
    public appSharedService: AppSharedService,
    private timeoutService: TimeoutService
  ) {}

  toggleSidenav() {
    this.navigationService.isSidenavOpened =
      !this.navigationService.isSidenavOpened;
    this.sidenav.toggle();
  }

  selectSection(section: string) {
    this.navigationService.isSidenavOpened = true;
    if (section === Constants.PURCHASES) {
      this.navigationService.menu = PURCHASE;
    } else if (section === Constants.PARTY) {
      this.navigationService.menu = PARTY;
    } else {
      this.navigationService.menu = null;
    }
    this.navigationService.setFocus(section);
  }

  onLogout() {
    this.timeoutService.inSession = false;
    this.navigationService.logout(this.timeoutService.interval);
  }
}
