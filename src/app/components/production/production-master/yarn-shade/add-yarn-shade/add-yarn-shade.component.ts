import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { MasterService } from 'src/app/services/master.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-yarn-shade',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-yarn-shade.component.html',
  styleUrls: ['./add-yarn-shade.component.scss'],
})
export class AddYarnShadeComponent implements OnDestroy {
  shade = new FormControl('', Validators.required);
  subscription = new Subscription();

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private masterService: MasterService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.shade.invalid) {
      this.shade.markAsTouched();
      return;
    }
    this.subscription.add(
      this.masterService.addYarnShade(this.shade.value || '').subscribe({
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
