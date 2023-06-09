import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NavigationService } from 'src/app/shared/navigation.service';
import { RecoveryDetailsComponent } from './recovery-details/recovery-details.component';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-yarn-recovery',
  templateUrl: './yarn-recovery.component.html',
  styleUrls: ['./yarn-recovery.component.scss'],
})
export class YarnRecoveryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'programNo',
    'programDate',
    'shadeName',
    'blendName',
    'plannedQty',
    'mixedQuantity',
    'yarnLot',
    'productionQty',
    'wasteQuantity',
    'yarnRecoveryPercent',
  ];
  dataSource = new MatTableDataSource<any>([]);
  subscription = new Subscription();
  loader = false;
  private paginator!: MatPaginator;
  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private yarnService: YarnService,
    private notificationService: NotificationService
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
    this.dataSource = new MatTableDataSource([] as never);
  }

  ngOnInit() {
    this.loader = true;
    this.subscription.add(
      this.yarnService
        .getYarnRecoverySummary()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
          },
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRecoveryDetails(row: any) {
    this.dialog.open(RecoveryDetailsComponent, { data: row, minWidth: 500 });
  }
}
