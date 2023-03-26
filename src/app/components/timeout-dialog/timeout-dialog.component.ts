import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TimeoutService } from 'src/app/shared/timeout.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-timeout-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './timeout-dialog.component.html',
  styleUrls: ['./timeout-dialog.component.scss']
})
export class TimeoutDialogComponent implements OnInit, OnDestroy {
  countDown = environment.timeout;
  subscription = new Subscription();

  constructor(private idle: Idle, private timeoutService: TimeoutService, private matDialogRef: MatDialogRef<TimeoutDialogComponent>) {}

  ngOnInit() {
    const timeoutWarning = this.idle.onTimeoutWarning.subscribe((countdown) => this.countDown = countdown);
    const idleEnd = this.idle.onIdleEnd.subscribe(() => {
      this.idle.watch();
      this.matDialogRef.close();
    });
    const timeout = this.idle.onTimeout.subscribe(() => {
      this.timeoutService.logout();
      this.matDialogRef.close()
    });
    this.subscription.add(timeoutWarning);
    this.subscription.add(idleEnd);
    this.subscription.add(timeout);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
