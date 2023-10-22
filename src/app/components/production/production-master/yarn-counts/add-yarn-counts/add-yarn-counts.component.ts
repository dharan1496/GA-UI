import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { MasterService } from 'src/app/services/master.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-yarn-counts',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-yarn-counts.component.html',
  styleUrls: ['./add-yarn-counts.component.scss'],
})
export class AddYarnCountsComponent implements OnDestroy {
  counts = new FormControl('', Validators.required);
  subscription = new Subscription();

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private masterService: MasterService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.counts.invalid) {
      this.counts.markAsTouched();
      return;
    }
    this.subscription.add(
      this.masterService.addYarnCounts(this.counts.value || '').subscribe({
        next: () => this.close(),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.matDialogRef.close();
  }
}
