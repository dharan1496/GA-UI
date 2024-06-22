import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { FibreStock } from 'src/app/models/fibreStock';
import { FibreType } from 'src/app/models/fibreType';
import { FibreService } from 'src/app/services/fibre.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { StockDetailsComponent } from '../stock-details/stock-details.component';
import { FibreShade } from 'src/app/models/fibreShade';
import { OpeningStockFibreDts } from 'src/app/models/openingStockFibreDts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-open-stock',
  templateUrl: './search-open-stock.component.html',
  styleUrls: ['./search-open-stock.component.scss'],
})
export class SearchOpenStockComponent {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<OpeningStockFibreDts>([]);
  displayedColumns = [
    'stockAddedDate',
    'fiberTypeName',
    'fiberShadeName',
    'lot',
    'hsnCode',
    'stockWeight',
    'stockBales',
    'availableBalance',
    'action',
  ];
  loader = false;
  private paginator!: MatPaginator;
  form!: FormGroup;
  fibreTypes!: FibreType[];
  shades!: FibreShade[];
  @ViewChild(MatTable) table!: MatTable<any>;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public fibreService: FibreService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
    this.dataSource = new MatTableDataSource([] as never);
  }

  ngOnInit() {
    this.subscription.add(
      this.fibreService.getFibres().subscribe({
        next: (response) => (this.fibreTypes = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.fibreService.getFibreShade().subscribe({
        next: (response) => (this.shades = response),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.form = this.formBuilder.group({
      lot: ['', Validators.required],
      fibreId: '',
      shadeId: '',
    });
  }

  getFibreStock() {
    this.loader = true;
    const { lot, fibreId, shadeId } = this.form.value;
    this.subscription.add(
      this.fibreService
        .searchFiberOpeningStock(lot, fibreId || 0, shadeId || 0)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => {
            this.dataSource.data = data;
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

  openStockDetails(row: FibreStock) {
    this.dialog.open(StockDetailsComponent, { data: row, minWidth: '65vw' });
  }

  onReset() {
    this.form.reset();
  }

  onSearch() {
    if (this.form.valid) {
      this.getFibreStock();
    } else {
      this.form.markAllAsTouched();
    }
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    const splittedDate = date?.split(' ')[0]?.split('/');

    return `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`;
  }

  editStock(stock: OpeningStockFibreDts) {
    this.router.navigateByUrl('/purchases/fibre/edit-stock');
    sessionStorage.setItem('editStock', JSON.stringify(stock));
  }
}
