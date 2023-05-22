import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-sales-master',
  templateUrl: './sales-master.component.html',
  styleUrls: ['./sales-master.component.scss'],
})
export class SalesMasterComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }
}
