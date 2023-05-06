import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/notification.service';
import { AddYarnShadeComponent } from './add-yarn-shade/add-yarn-shade.component';
import { Subscription, finalize } from 'rxjs';
import { YarnService } from 'src/app/services/yarn.service';
import { YarnShade } from 'src/app/models/yarnShade';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';

@Component({
  selector: 'app-yarn-shade',
  templateUrl: './yarn-shade.component.html',
  styleUrls: ['./yarn-shade.component.scss'],
})
export class YarnShadeComponent implements OnInit, OnDestroy {
  dataSource: YarnShade[] = [];
  displayedColumns = ['sNo', 'shadeName', 'button'];
  loader = false;
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private yarnService: YarnService
  ) {}

  ngOnInit() {
    this.getYarnShade();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getYarnShade() {
    this.loader = true;
    this.subscription.add(
      this.yarnService
        .getYarnShade()
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

  addYarnShade() {
    this.dialog
      .open(AddYarnShadeComponent)
      .afterClosed()
      .subscribe(() => this.getYarnShade());
  }

  removeYarnShade() {
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
