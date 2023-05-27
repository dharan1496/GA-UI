import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { FibreCategory } from 'src/app/models/fibreCategory';
import { FibreType } from 'src/app/models/fibreType';
import { ProgramWaste } from 'src/app/models/programWaste';
import { FibreService } from 'src/app/services/fibre.service';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-recovery-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './recovery-details.component.html',
  styleUrls: ['./recovery-details.component.scss'],
})
export class RecoveryDetailsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  programDetails!: ConversionProgram;
  wasteDetails: ProgramWaste[] = [];
  wasteColumns = ['sNo', 'wasteCategory', 'wasteQty'];
  yarnCountsColumns = ['sNo', 'counts', 'programQty', 'producedQty'];
  mixingSummaryColumns = ['sNo', 'fibreType', 'fibreCategory', 'issueQty'];
  fibreCategories!: FibreCategory[];
  fibreTypes!: FibreType[];

  constructor(
    private matDialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private yarnService: YarnService,
    private notificationService: NotificationService,
    private fibreService: FibreService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.fibreService.getFibreCategories().subscribe({
        next: (response) => (this.fibreCategories = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.fibreService.getFibres().subscribe({
        next: (response) => (this.fibreTypes = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.yarnService.getProgramDetailsById(this.data?.programId).subscribe({
        next: (response) => (this.programDetails = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.yarnService.getProgramWasteById(this.data?.programId).subscribe({
        next: (response) => (this.wasteDetails = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFibreType(id: number): string {
    return (
      this.fibreTypes.find((fibre) => fibre.fibreTypeId === id)?.fibreType || ''
    );
  }

  getFibreCategory(id: number): string {
    return (
      this.fibreCategories.find((fibre) => fibre.fibreCategoryId === id)
        ?.fibreCategoryName || ''
    );
  }

  close() {
    this.matDialogRef.close();
  }
}
