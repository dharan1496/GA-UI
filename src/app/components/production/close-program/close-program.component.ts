import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-close-program',
  templateUrl: './close-program.component.html',
  styleUrls: ['./close-program.component.scss'],
})
export class CloseProgramComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }
}
