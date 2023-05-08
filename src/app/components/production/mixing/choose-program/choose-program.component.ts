import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { ProgramForMixing } from 'src/app/models/programForMixing';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-program',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './choose-program.component.html',
  styleUrls: ['./choose-program.component.scss'],
})
export class ChooseProgramComponent implements OnInit, OnDestroy {
  programs!: ProgramForMixing[];
  selection = new SelectionModel<ProgramForMixing>(false, []);
  displayedColumns = [
    'programNo',
    'shade',
    'blend',
    'yarnCounts',
    'plannedQuantity',
    'producedQuantity',
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
        .getProgramsForMixing()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.programs = data),
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

  submit() {
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select a program to continue',
        NotifyType.ERROR
      );
      return;
    }
    this.matDialogRef.close(this.selection.selected.shift()?.programId);
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
