import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { FibreShade } from 'src/app/models/fibreShade';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AddFibreShadeComponent } from './add-fibre-shade/add-fibre-shade.component';
import { UserActionConfirmationComponent } from 'src/app/components/user-action-confirmation/user-action-confirmation.component';

@Component({
  selector: 'app-fibre-shade',
  templateUrl: './fibre-shade.component.html',
  styleUrls: ['./fibre-shade.component.scss'],
})
export class FibreShadeComponent implements OnInit, OnDestroy {
  dataSource: FibreShade[] = [];
  displayedColumns = ['sNo', 'shadeName', 'button'];
  loader = false;
  subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private fibreService: FibreService
  ) {}

  ngOnInit() {
    this.getFibreShade();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFibreShade() {
    this.loader = true;
    this.subscription.add(
      this.fibreService
        .getFibreShade()
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

  addFibreShade() {
    this.dialog
      .open(AddFibreShadeComponent)
      .afterClosed()
      .subscribe(() => this.getFibreShade());
  }

  removeFibreShade() {
    this.dialog
      .open(UserActionConfirmationComponent)
      .afterClosed()
      .subscribe({
        next: (action) => {
          if (action) {
            // delete fibre
          }
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }
}
