import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-fibre-master',
  templateUrl: './fibre-master.component.html',
  styleUrls: ['./fibre-master.component.scss'],
})
export class FibreMasterComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }
}
