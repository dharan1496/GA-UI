import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { NavigationService } from '../shared/navigation.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  constructor(public navigationService: NavigationService) {}

}
