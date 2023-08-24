import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { FibreStock } from 'src/app/models/fibreStock';
import { FibreType } from 'src/app/models/fibreType';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { DatePipe } from '@angular/common';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-fibre-stock',
  templateUrl: './fibre-stock.component.html',
  styleUrls: ['./fibre-stock.component.scss'],
})
export class FibreStockComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  dataSource = new MatTableDataSource<FibreStock>([]);
  displayedColumns = [
    'sNo',
    'receivedDCNo',
    'party',
    'fibreType',
    'shadeName',
    'lot',
    'receivedQty',
    'issuedQty',
    'stock',
    'rate',
    'amount',
  ];
  loader = false;
  private paginator!: MatPaginator;
  form!: FormGroup;
  fibreTypes!: FibreType[];
  @ViewChild(MatTable) table!: MatTable<any>;
  dataSourceBackup = new MatTableDataSource<FibreStock>([]);

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
    public partyService: PartyService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private printService: PrintService
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
    this.dataSource = new MatTableDataSource([] as never);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      asOnDate: ['', Validators.required],
      partyId: '',
      fibreTypeId: '',
    });

    this.subscription.add(
      this.partyService.getParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
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
  }

  getFibreStock() {
    this.loader = true;
    const asOnDate = this.datePipe.transform(
      this.form.value.asOnDate,
      'dd/MM/yyyy'
    ) as string;
    const { partyId, fibreTypeId } = this.form.value;
    this.subscription.add(
      this.fibreService
        .searchFibreStock(asOnDate, partyId, fibreTypeId)
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

  openStockDetails(row: FibreStock) {
    this.dialog.open(StockDetailsComponent, { data: row, minWidth: '75vw' });
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

  stockAboveZero(event: any) {
    const checked = event?.checked;
    if (checked) {
      this.dataSourceBackup.data = this.dataSource.data;
      this.dataSource.data = this.dataSource.data.filter(
        (data) => data.stock > 0
      );
    } else {
      this.dataSource.data = this.dataSourceBackup.data;
    }
    this.table.renderRows();
  }

  printStocks() {
    this.printService.fibreStockPrint = true;
    this.printService.fibreStocks = this.dataSource.data;
    this.printService.fibreStockAsOnDate = this.form.value.asOnDate;
    setTimeout(() => window.print());
  }
}
