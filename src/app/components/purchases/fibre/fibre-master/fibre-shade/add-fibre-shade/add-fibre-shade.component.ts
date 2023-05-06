import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-fibre-shade',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-fibre-shade.component.html',
  styleUrls: ['./add-fibre-shade.component.scss'],
})
export class AddFibreShadeComponent {
  shade = new FormControl('', Validators.required);

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private fibreService: FibreService,
    private notificationService: NotificationService
  ) {}

  submit() {
    if (this.shade.invalid) {
      this.shade.markAsTouched();
      return;
    }
    this.fibreService.addFibreShade(this.shade.value || '').subscribe({
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
