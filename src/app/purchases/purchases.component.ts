import { Component } from '@angular/core';
import { PURCHASE } from 'src/constants/purchase-menu-values.const';
import { NavigationService } from '../shared/navigation.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent {

  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = PURCHASE;
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus('purchases');
  }

}
