import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { FibreWasteCategory } from 'src/app/models/fibreWasteCategory';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserActionConfirmationComponent } from '../../user-action-confirmation/user-action-confirmation.component';
import { AddWasteComponent } from './add-waste/add-waste.component';
import { NavigationService } from 'src/app/shared/navigation.service';
import { Constants } from 'src/app/constants/constants';
import { WASTE } from 'src/app/constants/waste-menu-values.const';

@Component({
  selector: 'app-waste-master',
  templateUrl: './waste-master.component.html',
  styleUrls: ['./waste-master.component.scss'],
})
export class WasteMasterComponent {
  dataSource: FibreWasteCategory[] = [];
  displayedColumns = ['sNo', 'wasteName', 'button'];
  loader = false;
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private navigationService: NavigationService
  ) {
    this.navigationService.setFocus(Constants.WASTE);
    this.navigationService.menu = WASTE;
  }

  ngOnInit() {
    this.getWaste();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getWaste() {
    this.loader = true;
    this.subscription.add(
      this.fibreService
        .getWasteCategory()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.dataSource = data),
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  addWaste() {
    this.dialog
      .open(AddWasteComponent)
      .afterClosed()
      .subscribe(() => this.getWaste());
  }

  removeWaste() {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe({
        next: (action) => {
          if (action) {
            // delete
          }
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }
}
