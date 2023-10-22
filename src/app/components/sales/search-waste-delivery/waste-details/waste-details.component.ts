import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FibreSalesDC } from 'src/app/models/fibreSalesDC';
import { FibreSalesDCDetails } from 'src/app/models/fibreSalesDCDetails';

@Component({
  selector: 'app-waste-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './waste-details.component.html',
  styleUrls: ['./waste-details.component.scss'],
})
export class WasteDetailsComponent implements OnInit {
  displayedColumns = ['sNo', 'wasteCategoryName', 'quantity'];
  dataSource: FibreSalesDCDetails[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: FibreSalesDC,
    private matDialogRef: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.dataSource = this.data.salesDCDetails;
  }

  close() {
    this.matDialogRef.close();
  }

  getTotalQuantity() {
    return this.dataSource
      .map((data: any) => data?.quantity)
      .reduce((acc, value) => acc + value, 0);
  }
}
