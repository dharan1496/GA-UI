import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { FibreStock } from 'src/app/models/fibreStock';
import { FibreService } from 'src/app/services/fibre.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-fibre-stock',
  templateUrl: './fibre-stock.component.html',
  styleUrls: ['./fibre-stock.component.scss'],
})
export class FibreStockComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<FibreStock>([]);
  displayedColumns = [
    'sNo',
    'receivedDCNo',
    'fibreCategoryName',
    'categoryCode',
    'fibreType',
    'shadeName',
    'lot',
    'stock',
  ];
  loader = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public fibreService: FibreService,
    private notificationService: NotificationService,
    private navigationService: NavigationService
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
    this.dataSource = new MatTableDataSource([] as never);
  }

  ngOnInit() {
    this.getFibreStock();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getFibreStock() {
    this.loader = true;
    this.subscription.add(
      this.fibreService
        .getFibreStock()
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.dataSource.data = data),
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
