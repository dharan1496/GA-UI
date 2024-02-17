import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ProductionEntry } from 'src/app/models/productionEntry';
import { ProductionYarn } from 'src/app/models/productionYarn';

@Component({
  selector: 'app-production-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './production-details.component.html',
  styleUrls: ['./production-details.component.scss'],
})
export class ProductionDetailsComponent {
  subscription = new Subscription();
  columnsToDisplay = [
    'countsId',
    'lot',
    'isWinded',
    'productionQuantity',
    'deliveredQuantity',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public productionDetails: ProductionEntry,
    private matDialogRef: MatDialogRef<any>
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.matDialogRef.close();
  }

  getTotalDeliveredQty() {
    return this.productionDetails.yarnDetails
      .map((data: ProductionYarn) => +data.deliveredQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalProductionQty() {
    return this.productionDetails.yarnDetails
      .map((data: ProductionYarn) => +data.productionQuantity)
      .reduce((acc, value) => acc + value, 0);
  }
}
