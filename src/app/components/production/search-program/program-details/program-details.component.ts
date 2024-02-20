import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
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
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, void <=> *',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProgramDetailsComponent {
  subscription = new Subscription();
  mixingColumnsToDisplay = [
    'expand',
    'mixingId',
    'mixingDate',
    'totalIssued',
    'action',
  ];

  innerDisplayedColumns = [
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
  expandedElement: any;
  outerTable = [];
  innerTable = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public programDetails: ConversionProgram,
    private matDialogRef: MatDialogRef<any>,
    private router: Router
  ) {}

  ngOnInit() {
    const mixingIds = [
      ...new Set(
        this.programDetails?.mixingDetails?.map((data: any) => data.mixingId)
      ),
    ];
    mixingIds.forEach((id) => {
      this.outerTable.push(
        this.programDetails?.mixingDetails?.find(
          (data) => data.mixingId === id
        ) as never
      );
    });
  }

  getInnerTableData(id: number) {
    return this.programDetails?.mixingDetails?.filter(
      (data) => data.mixingId === id
    ) as never;
  }

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

  updateMixing(id: number) {
    sessionStorage.setItem('program', JSON.stringify(this.programDetails));
    sessionStorage.setItem(
      'mixingDetails',
      JSON.stringify(
        this.programDetails?.mixingDetails?.filter(
          (data) => data.mixingId === id
        )
      )
    );
    this.router.navigateByUrl('/production/update-mixing');
    this.matDialogRef.close();
  }

  getTotalMixingIssuedQty(id: number) {
    return this.programDetails.mixingDetails
      ?.filter((details) => details.mixingId === id)
      ?.map((data: ProgramFibresMixed) => +data.issuedQuantity)
      ?.reduce((acc, value) => acc + value, 0);
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

  scrollInto(id: string) {
    setTimeout(
      () =>
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
        }),
      250
    );
  }
}
