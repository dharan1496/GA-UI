import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';

@Component({
  selector: 'app-reopen-program',
  templateUrl: './reopen-program.component.html',
  styleUrls: ['./reopen-program.component.scss'],
})
export class ReopenProgramComponent {
  constructor(private navigationService: NavigationService) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }
}
