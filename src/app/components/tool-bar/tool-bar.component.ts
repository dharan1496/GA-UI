import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';

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
    public appSharedService: AppSharedService
  ) {}

  toggleSidenav() {
    this.navigationService.isSidenavOpened = !this.navigationService.isSidenavOpened;
    this.sidenav.toggle();
  }

  selectSection(section: string) {
    // Temp - start, needed until production and sales component add
    if (section !== 'purchases') {
      this.navigationService.menu = null
    }
    this.navigationService.setFocus(section);
    // Temp - end
    this.router.navigateByUrl(section);
  }

  onLogout() {
    localStorage.clear();
    this.appSharedService.logout = true;
    this.navigationService.isSidenavOpened = false;
    this.navigationService.menu = null;
    this.navigationService.removeFocus();
  }

}
