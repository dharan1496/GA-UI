import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { FibreService } from 'src/app/services/fibre.service';
import { MasterService } from 'src/app/services/master.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-waste',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-waste.component.html',
  styleUrls: ['./add-waste.component.scss'],
})
export class AddWasteComponent implements OnDestroy {
  waste = new FormControl('', Validators.required);
  subscription = new Subscription();

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private masterService: MasterService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.waste.invalid) {
      this.waste.markAsTouched();
      return;
    }
    this.subscription.add(
      this.masterService.addWasteCategory(this.waste.value || '').subscribe({
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
