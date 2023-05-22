import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import { RecoveryDetailsComponent } from './recovery-details/recovery-details.component';

@Component({
  selector: 'app-yarn-recovery',
  templateUrl: './yarn-recovery.component.html',
  styleUrls: ['./yarn-recovery.component.scss'],
})
export class YarnRecoveryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'letterNo',
    'buyer',
    'shadeNo',
    'blend',
    'blendDesc',
    'lot',
    'counts',
    'letterQty',
    'mixedQty',
    'prodQty',
    'mixingWaste',
    'wastePerc',
    'recoveryPerc',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private navigationService: NavigationService,
    private dialog: MatDialog
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([
      {
        letterNo: 12,
        buyer: 'test',
        shade: 'blue',
        blend: 'P50:C50',
        blendDesc: 'Polyster: 50%, Cotton: 50%',
        lot: 'e3',
        counts: '10s',
        letterQty: 500,
        mixedQty: 500,
        producedQty: 475,
        mixingWaste: 25,
        wastePercent: 5,
        recoveryPercent: 95,
      },
      {
        letterNo: 13,
        buyer: 'test1',
        shade: 'green',
        blend: 'P50:S50',
        blendDesc: 'Polyster: 50%, Silk: 50%',
        lot: 'e3',
        counts: '10s',
        letterQty: 1000,
        mixedQty: 1000,
        producedQty: 950,
        mixingWaste: 50,
        wastePercent: 5,
        recoveryPercent: 95,
      },
      {
        letterNo: 14,
        buyer: 'test2',
        shade: 'red',
        blend: 'P50:V50',
        blendDesc: 'Polyster: 50%, viscose: 50%',
        lot: 'e3',
        counts: '10s',
        letterQty: 2000,
        mixedQty: 2000,
        producedQty: 1900,
        mixingWaste: 100,
        wastePercent: 5,
        recoveryPercent: 95,
      },
    ] as never);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRecoveryDetails(row: any) {
    this.dialog.open(RecoveryDetailsComponent, { data: row });
  }
}
