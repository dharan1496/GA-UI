import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { YarnBlend } from 'src/app/models/yarnBlend';
import { YarnService } from 'src/app/services/yarn.service';
import { AddBlendComponent } from './add-blend/add-blend.component';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-yarn-blend',
  templateUrl: './yarn-blend.component.html',
  styleUrls: ['./yarn-blend.component.scss'],
})
export class YarnBlendComponent implements OnInit, OnDestroy {
  dataSource = [];
  displayedColumns = ['fibreCategory', 'percentage'];
  loader = false;
  blendList: YarnBlend[] = [];
  subscription = new Subscription();

  constructor(
    private yarnService: YarnService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getBlend();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBlend() {
    this.subscription.add(
      this.yarnService.getYarnBlend().subscribe({
        next: (data) => (this.blendList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  addyarnBlend() {
    this.dialog
      .open(AddBlendComponent)
      .afterClosed()
      .subscribe(() => this.getBlend());
  }

  removeBlend(blend: YarnBlend) {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe({
        next: (action) => {
          if (action) {
            // delete
            blend;
          }
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }

  open(panel: MatExpansionPanel) {
    document
      .getElementById(panel.id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
