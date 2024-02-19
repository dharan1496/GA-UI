import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { FibreCategory } from 'src/app/models/fibreCategory';
import { FibreType } from 'src/app/models/fibreType';
import { ProgramWaste } from 'src/app/models/programWaste';
import { ConversionService } from 'src/app/services/conversion.service';
import { FibreService } from 'src/app/services/fibre.service';
import {
  PrintService,
  YarnRecoveryDetails,
} from 'src/app/services/print.service';
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
  mixingSummaryColumns = [
    'sNo',
    'receivedDCNo',
    'receivedDate',
    'fibreType',
    'fibreShade',
    'lot',
    'issueQty',
    'rate',
    'amount',
  ];
  fibreCategories!: FibreCategory[];
  fibreTypes!: FibreType[];
  loader = true;
  expanded = false;

  constructor(
    private matDialogRef: MatDialogRef<RecoveryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conversionService: ConversionService,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private printService: PrintService
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
      this.conversionService
        .getProgramDetailsById(this.data?.programId)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (response) => (this.programDetails = response),
          error: (error) => {
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
            this.matDialogRef.close();
          },
        })
    );

    this.subscription.add(
      this.conversionService
        .getProgramWasteById(this.data?.programId)
        .subscribe({
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

  close() {
    this.matDialogRef.close();
  }

  expand() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.matDialogRef.updateSize('100vw', '100vh');
      document
        .querySelector('.mat-mdc-dialog-content')
        ?.classList.add('max-height-88');
    } else {
      this.matDialogRef.updateSize('75vw');
      document
        .querySelector('.mat-mdc-dialog-content')
        ?.classList.remove('max-height-88');
    }
  }

  print() {
    this.printService.yarnRecoveryPrint = true;
    this.printService.yarnRecoveryDetails = {
      programDetails: this.programDetails,
      wasteDetails: this.wasteDetails,
      data: this.data,
    } as YarnRecoveryDetails;
    setTimeout(() => window.print());
  }
}
