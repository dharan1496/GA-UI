import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const path = window.location.pathname;
    if (path.includes('fibre-new-purchase-order')) {
      this.menu = PURCHASE;
      this.setFocus('purchase');
    }
  }

  setFocus(id: string) {
    this.removeFocus();
    document.querySelector(`#${id}`)?.classList.add('item-selected');   
  }

  removeFocus() {
    document.querySelectorAll('button')?.forEach(element => element?.classList.remove('item-selected'));
  }

  selectSection(section: string) {
    this.setFocus(section);
    if (section === 'purchase') {
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
