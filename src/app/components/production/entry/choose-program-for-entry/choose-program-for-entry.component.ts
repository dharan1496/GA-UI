import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { ProgramForProductionEntry } from 'src/app/models/programForProductionEntry';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-program-for-entry',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './choose-program-for-entry.component.html',
  styleUrls: ['./choose-program-for-entry.component.scss'],
})
export class ChooseProgramForEntryComponent implements OnInit, OnDestroy {
  programs!: ProgramForProductionEntry[];
  selection = new SelectionModel<ProgramForProductionEntry>(false, []);
  displayedColumns = [
    'programNo',
    'shade',
    'blend',
    'mixingDate',
    'mixedQty',
    'yarnCounts',
    'programQty',
    'productionQty',
    'select',
  ];
  subscription = new Subscription();
  loader = false;

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.subscription.add(
      this.yarnService
        .getProgramsForProductionEntry()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.programs = data),
          error: (error) => {
            this.programs = [];
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

  submit() {
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select a program to continue',
        NotifyType.ERROR
      );
      return;
    }
    this.matDialogRef.close(this.selection.selected.shift());
  }

  close() {
    this.matDialogRef.close();
  }

  radioLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  selectItem(row: any) {
    this.selection.toggle(row);
  }
}
