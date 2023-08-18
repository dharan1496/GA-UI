import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { FibreWasteCategory } from 'src/app/models/fibreWasteCategory';
import { AddWasteComponent } from './add-waste/add-waste.component';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss'],
})
export class WasteComponent implements OnInit, OnDestroy {
  dataSource: FibreWasteCategory[] = [];
  displayedColumns = ['sNo', 'wasteName', 'button'];
  loader = false;
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private fibreService: FibreService
  ) {}

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
