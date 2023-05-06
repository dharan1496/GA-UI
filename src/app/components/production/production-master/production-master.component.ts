import { AfterViewInit, Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-production-master',
  templateUrl: './production-master.component.html',
  styleUrls: ['./production-master.component.scss'],
})
export class ProductionMasterComponent implements AfterViewInit {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngAfterViewInit() {
    document
      .querySelector('mat-tab-header')
      ?.classList.add('tab-header-border');
  }
}
