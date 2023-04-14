import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { FibreService } from 'src/app/services/fibre.service';
import { AddFibreTypeComponent } from './add-fibre-type/add-fibre-type.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { FibreType } from 'src/app/models/fibreType';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';

@Component({
  selector: 'app-fibre-list',
  templateUrl: './fibre-list.component.html',
  styleUrls: ['./fibre-list.component.scss'],
})
export class FibreListComponent implements OnInit {
  subscription = new Subscription();
  edit = false;
  dataSource: FibreType[] = [];
  displayedColumns = ['sNo', 'fibreType', 'button'];
  loader = false;

  constructor(
    public fibreService: FibreService,
    private dialog: MatDialog,
    private navigationService: NavigationService
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit() {
    this.getFibre();
  }

  getFibre() {
    this.loader = true;
    this.subscription.add(
      this.fibreService
        .getFibres()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe((data) => (this.dataSource = data))
    );
  }

  addFibre() {
    this.dialog
      .open(AddFibreTypeComponent)
      .afterClosed()
      .subscribe(() => this.getFibre());
  }

  removeData(fibre: FibreType) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe((action) => {
        if (action) {
          // delete fibre
        }
      });
  }
}
