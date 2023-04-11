import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { AppSharedService } from './app-shared.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  menu!: any[] | null;
  isSidenavOpened = false;

  constructor(
    private idle: Idle,
    private router: Router,
    private appSharedService: AppSharedService,
    private dialog: MatDialog
  ) {}

  setFocus(id: string) {
    this.removeFocus();
    document.querySelector(`#${id}`)?.classList.add('item-selected');
  }

  removeFocus() {
    document
      .querySelectorAll('button')
      ?.forEach((element) => element?.classList.remove('item-selected'));
  }

  logout(interval: any) {
    this.dialog.closeAll();
    this.appSharedService.logout = true;
    this.isSidenavOpened = false;
    this.menu = null;
    this.removeFocus();
    clearInterval(interval); // clear the sleep mode interval for session timeout
    this.idle.stop(); // stops the idle listener
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
