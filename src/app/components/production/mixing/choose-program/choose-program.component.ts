import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-program',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './choose-program.component.html',
  styleUrls: ['./choose-program.component.scss'],
})
export class ChooseProgramComponent implements OnInit {
  dataSource = [];
  selection = new SelectionModel<any>(false, []);
  displayedColumns = [
    'programNo',
    'shade',
    'blend',
    'yarnCounts',
    'plannedQty',
    'prodQty',
    'select',
  ];

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService
  ) {}

  ngOnInit() {
    // temp
    this.dataSource = [
      {
        programNo: '1234',
        shade: 'blue',
        blend: 'test',
        yarnCounts: '10s',
        plannedQty: 234,
        prodQty: 34,
      } as never,
      {
        programNo: '1244',
        shade: 'blue',
        blend: 'test',
        yarnCounts: '10s',
        plannedQty: 234,
        prodQty: 34,
      } as never,
    ];
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
