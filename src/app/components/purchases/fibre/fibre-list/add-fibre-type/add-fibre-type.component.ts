import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-fibre-type',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-fibre-type.component.html',
  styleUrls: ['./add-fibre-type.component.scss'],
})
export class AddFibreTypeComponent {
  fibre = new FormControl('', Validators.required);

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private fibreService: FibreService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.fibre.invalid) {
      this.fibre.markAsTouched();
      return;
    }
    this.fibreService.addFibre(this.fibre.value || '').subscribe({
      next: () => this.close(),
      error: (error) =>
        this.notificationService.error(error?.error || error?.message),
    });
  }

  close() {
    this.matDialogRef.close();
  }
}
