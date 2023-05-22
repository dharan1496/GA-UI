import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-deliver-sales-order',
  templateUrl: './delivery-sales-order.component.html',
  styleUrls: ['./delivery-sales-order.component.scss'],
})
export class DeliverySalesOrderComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }
}
