import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { environment } from 'src/environment/environment';
import { TimeoutDialogComponent } from '../components/timeout-dialog/timeout-dialog.component';
import { NavigationService } from './navigation.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeoutService {
  inSession = false;
  interval: any;
  dialogRef!: MatDialogRef<TimeoutDialogComponent>;
  sleepMode = new Subject<void>();
  intervalTime = 2000;

  constructor(
    private idle: Idle,
    private dialog: MatDialog,
    private navigationService: NavigationService
  ) {}

  init() {
    this.checkSleepMode();
    this.inSession = true;
    this.idle.setIdle(environment.idleTime);
    this.idle.setTimeout(environment.timeout);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleStart.subscribe(
      () => (this.dialogRef = this.dialog.open(TimeoutDialogComponent))
    );
    this.idle.watch();
  }

  checkSleepMode() {
    let lastTime = Date.now();
    this.interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastTime;
      const time = (environment.idleTime + environment.timeout) * 1000;
      if (diff > time + this.intervalTime) {
        this.dialogRef?.close();
        this.sleepMode.next();
        this.logout();
      }
      lastTime = now;
    }, this.intervalTime);
  }

  logout() {
    this.inSession = false;
    this.navigationService.logout(this.interval);
  }
}
