import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class YarnRecoveryComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'programNo',
    'programDate',
    'shadeName',
    'blendName',
    'plannedQty',
    'mixedQty',
    'lot',
    'productionQty',
    'wasteQty',
    'recoveryPercent',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscription = new Subscription();
  loader = false;

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
          next: (data) => (this.dataSource = new MatTableDataSource(data)),
          error: (error) => {
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            );
          },
        })
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
