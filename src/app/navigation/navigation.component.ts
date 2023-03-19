import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { PURCHASE } from 'src/constants/purchase-menu-values.const';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isSidenavOpened = false;
  menu!: any[] | null;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  username = 'name';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.onPageLoad();
  }

  onPageLoad() {
    const path = window.location.pathname;
    if (path.includes('purchases') || path.includes('fibre-new-purchase-order') || path.includes('fibre-receive-purchase-order')) {
      if (path.includes('purchases')) {
        this.isSidenavOpened = true;
      }
      this.menu = PURCHASE;
      this.setFocus('purchases');
    } else if (path.includes('reset-password')) {
      this.isSidenavOpened = false;
      this.menu = null;
    }
  }

  onResetPassword() {
    this.removeFocus();
    this.isSidenavOpened = false;
    this.menu = null;
  }

  setFocus(id: string) {
    this.removeFocus();
    document.querySelector(`#${id}`)?.classList.add('item-selected');   
  }

  removeFocus() {
    document.querySelectorAll('button')?.forEach(element => element?.classList.remove('item-selected'));
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sidenav.toggle();
  }

  selectSection(section: string) {
    this.setFocus(section);
    if (section === 'purchases') {
      this.menu = PURCHASE;
    } else {
      this.menu = null;
    }
    this.isSidenavOpened = true;
    this.router.navigateByUrl(section);
  }

  onDashboard() {
    this.isSidenavOpened = false;
    this.menu = null;
    this.removeFocus();
  }

  routeTo(route: string) {
    this.isSidenavOpened = false;
    this.router.navigateByUrl(route);
  }

}
