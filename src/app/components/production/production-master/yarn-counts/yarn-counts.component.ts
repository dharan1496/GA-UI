import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { AddYarnCountsComponent } from './add-yarn-counts/add-yarn-counts.component';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-yarn-counts',
  templateUrl: './yarn-counts.component.html',
  styleUrls: ['./yarn-counts.component.scss'],
})
export class YarnCountsComponent implements OnInit, OnDestroy {
  dataSource: YarnCounts[] = [];
  displayedColumns = ['sNo', 'counts', 'button'];
  loader = false;
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.getYarnCounts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getYarnCounts() {
    this.loader = true;
    this.subscription.add(
      this.masterService
        .getYarnCounts()
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

  addYarnCounts() {
    this.dialog
      .open(AddYarnCountsComponent)
      .afterClosed()
      .subscribe(() => this.getYarnCounts());
  }

  removeYarnCounts() {
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
