import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-yarn-counts',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-yarn-counts.component.html',
  styleUrls: ['./add-yarn-counts.component.scss'],
})
export class AddYarnCountsComponent {
  counts = new FormControl('', Validators.required);

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.counts.invalid) {
      this.counts.markAsTouched();
      return;
    }
    this.yarnService.addYarnCounts(this.counts.value || '').subscribe({
      next: () => this.close(),
      error: (error) =>
        this.notificationService.error(
          typeof error?.error === 'string' ? error?.error : error?.message
        ),
    });
  }

  close() {
    this.matDialogRef.close();
  }
}
