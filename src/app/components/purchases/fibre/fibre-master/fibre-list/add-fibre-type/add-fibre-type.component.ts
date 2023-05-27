import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FibreCategory } from 'src/app/models/fibreCategory';
import { FibreType } from 'src/app/models/fibreType';
import { FibreService } from 'src/app/services/fibre.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-fibre-type',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-fibre-type.component.html',
  styleUrls: ['./add-fibre-type.component.scss'],
})
export class AddFibreTypeComponent implements OnInit {
  fibre = new FormControl('', Validators.required);
  fibreCategoryId = new FormControl('', Validators.required);
  fibreCategoryList: FibreCategory[] = [];

  constructor(
    private matDialogRef: MatDialogRef<any>,
    private fibreService: FibreService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.fibreService.getFibreCategories().subscribe({
      next: (data) => (this.fibreCategoryList = data),
      error: (error) =>
        this.notificationService.error(
          typeof error?.error === 'string' ? error?.error : error?.message
        ),
    });
  }

  submit() {
    if (this.fibre.invalid) {
      this.fibre.markAsTouched();
      return;
    }
    const fibreType: FibreType = {
      fibreTypeId: 0,
      fibreType: this.fibre.value || '',
      fibreCategoryId: +(this.fibreCategoryId.value || 0),
    };
    this.fibreService.addFibre(fibreType).subscribe({
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
