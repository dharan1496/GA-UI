import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-fibre-stock',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './fibre-stock.component.html',
  styleUrls: ['./fibre-stock.component.scss'],
})
export class FibreStockComponent implements OnInit {
  dataSource = [];
  displayedColumns = [
    'receivedDCNo',
    'fibreCategory',
    'fibre',
    'fibreShade',
    'lot',
    'stockQty',
  ];

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private yarnService: YarnService
  ) {}

  ngOnInit() {
    this.dataSource = [];
  }

  submit() {
    //
  }

  close() {
    this.matDialogRef.close();
  }
}
