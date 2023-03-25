import { Component } from '@angular/core';
import { NavigationService } from 'src/app/shared/navigation.service';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';

@Component({
  selector: 'app-pending-purchase-order',
  templateUrl: './pending-purchase-order.component.html',
  styleUrls: ['./pending-purchase-order.component.scss']
})
export class PendingPurchaseOrderComponent {

  constructor(private navigationService: NavigationService) {
    this.navigationService.isSidenavOpened = false;
    this.navigationService.setFocus('purchases');
    this.navigationService.menu = PURCHASE;
  }
}
