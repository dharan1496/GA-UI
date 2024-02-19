import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { ConversionYarn } from 'src/app/models/conversionYarn';
import { ProgramFibresMixed } from 'src/app/models/programFibresMixed';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss'],
})
export class ProgramDetailsComponent {
  subscription = new Subscription();
  mixingColumnsToDisplay = [
    'mixingId',
    'mixingDate',
    'fiberCategory',
    'fiberType',
    'fiberShade',
    'receivedDCNo',
    'receivedDate',
    'lot',
    'issuedQuantity',
    'rate',
  ];

  countsColumnsToDisplay = [
    'countsId',
    'counts',
    'programQuantity',
    'productionQuantity',
  ];
  expanded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public programDetails: ConversionProgram,
    private matDialogRef: MatDialogRef<any>,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.matDialogRef.close();
  }

  getTotalProgramQty() {
    return this.programDetails.yarnCounts
      .map((data: ConversionYarn) => +data.programQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalIssuedQty() {
    return this.programDetails.mixingDetails
      .map((data: ProgramFibresMixed) => +data.issuedQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalProductionQty() {
    return this.programDetails.yarnCounts
      .map((data: ConversionYarn) => +data.productionQuantity)
      .reduce((acc, value) => acc + value, 0);
  }

  updateMixing() {
    sessionStorage.setItem('program', JSON.stringify(this.programDetails));
    this.router.navigateByUrl('/production/update-mixing');
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
}
