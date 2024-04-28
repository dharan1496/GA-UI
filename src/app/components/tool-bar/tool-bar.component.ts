import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Constants } from 'src/app/constants/constants';
import { EMPLOYEE } from 'src/app/constants/employee-menu-values.const';
import { PARTY } from 'src/app/constants/party-menu-values.const';
import { PAYROLL } from 'src/app/constants/payroll-menu-values.const';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { TOOLBAR } from 'src/app/constants/toolbar-values.const';
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
  toolbarList = TOOLBAR;

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
    switch (section) {
      case Constants.PURCHASES:
        this.navigationService.menu = PURCHASE;
        break;
      case Constants.PRODUCTION:
        this.navigationService.menu = PRODUCTION;
        break;
      case Constants.SALES:
        this.navigationService.menu = SALES;
        break;
      case Constants.PARTY:
        this.navigationService.menu = PARTY;
        break;
      case Constants.EMPLOYEE:
        this.navigationService.menu = EMPLOYEE;
        break;
      case Constants.PAYROLL:
        this.navigationService.menu = PAYROLL;
        break;
      default:
        this.navigationService.menu = null;
    }
    this.navigationService.setFocus(section);
  }

  onLogout() {
    this.timeoutService.inSession = false;
    this.navigationService.logout(this.timeoutService.interval);
  }
}
