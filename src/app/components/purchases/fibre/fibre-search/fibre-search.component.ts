import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { PartyService } from 'src/app/services/party.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { DatePipe } from '@angular/common';
import { FibrePODts } from 'src/app/models/fibrePODts';
import { FibrePO } from 'src/app/models/fibrePO';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { CloseReopenFibreComponent } from './close-reopen-fibre/close-reopen-fibre.component';

@Component({
  selector: 'app-fibre-dashboard',
  templateUrl: './fibre-search.component.html',
  styleUrls: ['./fibre-search.component.scss'],
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
export class FibreSearchComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = [
    'expand',
    'pono',
    'podate',
    'partyName',
    'gstNo',
    'cityName',
    'emailId',
    'actions',
  ];
  innerDisplayedColumns = [
    'fibreType',
    'shadeName',
    'rate',
    'weight',
    'amountBeforeTax',
    'gstPercent',
    'amountAfterTax',
    'actions',
  ];
  expandedElement: any;
  loader = false;
  minDate = new Date();
  maxDate = new Date();
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
    public partyService: PartyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private router: Router,
    public appSharedService: AppSharedService,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private datePipe: DatePipe,
    private printService: PrintService,
    private dialog: MatDialog
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.setMinDate();
    this.subscription.add(
      this.partyService.getFibreParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );

    this.form = this.formBuilder.group({
      partyId: ['', Validators.required],
      poStartDate: ['', Validators.required],
      poEndDate: ['', Validators.required],
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'poDate': {
          const split = item?.podate?.split('/');
          if (split?.length === 3) {
            const date = `${split[1]}/${split[0]}/${split[2]}`;
            return new Date(date);
          }
          return item[property];
        }
        default:
          return item[property];
      }
    };

    const savedSearch = sessionStorage.getItem('search-fibre-po');
    sessionStorage.removeItem('search-fibre-po');
    if (savedSearch) {
      this.form.patchValue(JSON.parse(savedSearch));
      this.onSearch();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setMinDate() {
    this.minDate.setMonth(this.minDate.getMonth() - 12);
  }

  onSearch() {
    if (this.form.invalid) {
      this.notificationService.notify(
        'Error occured in search details!',
        NotifyType.ERROR
      );
      return;
    }
    this.loader = true;
    const { partyId, poStartDate, poEndDate } = this.form.value;
    this.fibreService
      .getFiberPOsByParty(
        partyId,
        this.datePipe.transform(poStartDate, 'dd/MM/yyyy') || '',
        this.datePipe.transform(poEndDate, 'dd/MM/yyyy') || ''
      )
      .pipe(finalize(() => (this.loader = false)))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response;
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      });
  }

  onReset() {
    this.form.reset();
  }

  updatePO(fibrePO: FibrePO) {
    sessionStorage.setItem('poDetails', JSON.stringify(fibrePO));
    sessionStorage.setItem('search-fibre-po', JSON.stringify(this.form.value));
    this.router.navigateByUrl('/purchases/fibre/update-purchase-order');
  }

  closePO(fibre: FibrePO, fibrePODts: FibrePODts) {
    this.dialog
      .open(CloseReopenFibreComponent, {
        data: {
          pono: fibre.pono,
          fibrePODts,
          action: 'Close',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.action === 'yes') {
          this.fibreService
            .closeFibrePO(fibrePODts.poDtsId, result?.remarks)
            .subscribe({
              next: (response) => {
                if (response === 'true') {
                  this.notificationService.success(
                    'Fibre closed successfully!'
                  );
                  fibrePODts.isPOItemClosed = true;
                  fibre.isPOClosed = fibre.fibrePODts.every(
                    (dts) => dts.isPOItemClosed
                  );
                } else {
                  this.notificationService.error('Unable to close the fibre');
                }
              },
              error: (error) =>
                this.notificationService.error(
                  typeof error?.error === 'string'
                    ? error?.error
                    : error?.message
                ),
            });
        }
      });
  }

  reopenPO(fibre: FibrePO, fibrePODts: FibrePODts) {
    this.dialog
      .open(CloseReopenFibreComponent, {
        data: {
          pono: fibre.pono,
          fibrePODts,
          action: 'Reopen',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.action === 'yes') {
          this.fibreService
            .reopenFibrePO(fibrePODts.poDtsId, result?.remarks)
            .subscribe({
              next: (response) => {
                if (response === 'true') {
                  this.notificationService.success(
                    'Fibre Reopened successfully!'
                  );
                  fibrePODts.isPOItemClosed = false;
                  fibre.isPOClosed = false;
                } else {
                  this.notificationService.error('Unable to reopen the fibre');
                }
              },
              error: (error) =>
                this.notificationService.error(
                  typeof error?.error === 'string'
                    ? error?.error
                    : error?.message
                ),
            });
        }
      });
  }

  printPO(fibrePO: FibrePO, event: any) {
    event.stopPropagation();
    const printFibre = JSON.parse(JSON.stringify(fibrePO));
    printFibre.fibrePODts = fibrePO.fibrePODts.filter(
      (dts) => !dts.isPOItemClosed
    );
    this.printService.fibrePOData = printFibre;
    this.printService.fibrePOprint = true;
    setTimeout(() => window.print());
  }

  getTotalWeight(fibrePODts: FibrePODts[]) {
    return fibrePODts
      .map((data: any) => data.weight)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount(fibrePODts: FibrePODts[]) {
    return fibrePODts
      .map((data: FibrePODts) => data.rate * data.weight)
      .reduce((acc, value) => acc + value, 0);
  }

  getAmountAfterTax(fibrePODt: FibrePODts) {
    return (
      fibrePODt.rate * fibrePODt.weight +
      fibrePODt.rate * fibrePODt.weight * (fibrePODt.gstPercent / 100)
    );
  }

  getTotalTaxAmount(fibrePODts: FibrePODts[]) {
    return fibrePODts
      .map(
        (data: FibrePODts) => data.rate * data.weight * (data.gstPercent / 100)
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmountAfterTax(fibrePODts: FibrePODts[]) {
    return fibrePODts
      .map((data: FibrePODts) => this.getAmountAfterTax(data))
      .reduce((acc, value) => acc + value, 0);
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
