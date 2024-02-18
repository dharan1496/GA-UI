import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { ReceiveFibrePO } from 'src/app/models/receiveFibrePO';
import { ReceiveFibrePODts } from 'src/app/models/receiveFibrePODts';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-fibre-received-order-search',
  templateUrl: './fibre-received-order-search.component.html',
  styleUrls: ['./fibre-received-order-search.component.scss'],
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
export class FibreReceivedOrderSearchComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = [
    'expand',
    'recdDCNo',
    'recdDate',
    'partyName',
    'dcDate',
    'actions',
  ];
  innerDisplayedColumns = [
    'poNo',
    'poDate',
    'fibreTypeName',
    'fiberShadeName',
    'lot',
    'receivedBales',
    'hsnCode',
    'rate',
    'receivedWeight',
    'amountBeforeTax',
    'gstPercent',
    'amountAfterTax',
  ];
  expandedElement: any;
  loader = false;
  minDate = new Date();
  maxDate = new Date();
  private paginator!: MatPaginator;
  private sort!: MatSort;
  conversionOrderCheckbox = new FormControl();
  backupDatasource: any;
  @ViewChild(MatTable) table!: MatTable<any>;

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
    public navigationService: NavigationService,
    private router: Router,
    public appSharedService: AppSharedService,
    private notificationService: NotificationService,
    private fibreService: FibreService,
    private datePipe: DatePipe
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.setMinDate();
    this.subscription.add(
      this.partyService.getParties().subscribe({
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
      .getFibersPurchasedByParty(
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

  updatePO(fibrePO: ReceiveFibrePO) {
    const isPO = fibrePO.fibrePODts.some((fibre) => fibre?.poNo);

    if (isPO) {
      sessionStorage.setItem('receivedPODetails', JSON.stringify(fibrePO));
      this.router.navigateByUrl(
        '/purchases/fibre/update-received-purchase-order'
      );
    } else {
      sessionStorage.setItem('receivedCODetails', JSON.stringify(fibrePO));
      this.router.navigateByUrl(
        '/purchases/fibre/update-received-conversion-order'
      );
    }
  }

  getTotalWeight(fibrePODts: ReceiveFibrePODts[]) {
    return fibrePODts
      .map((data: ReceiveFibrePODts) => data.receivedWeight)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount(fibrePODts: ReceiveFibrePODts[]) {
    return fibrePODts
      .map((data: ReceiveFibrePODts) => data.rate * data.receivedWeight)
      .reduce((acc, value) => acc + value, 0);
  }

  getAmountAfterTax(fibrePODt: ReceiveFibrePODts) {
    return (
      fibrePODt.rate * fibrePODt.receivedWeight +
      fibrePODt.rate * fibrePODt.receivedWeight * (fibrePODt.gstPercent / 100)
    );
  }

  getTotalTaxAmount(fibrePODts: ReceiveFibrePODts[]) {
    return fibrePODts
      .map(
        (data: ReceiveFibrePODts) =>
          data.rate * data.receivedWeight * (data.gstPercent / 100)
      )
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalAmountAfterTax(fibrePODts: ReceiveFibrePODts[]) {
    return fibrePODts
      .map((data: ReceiveFibrePODts) => this.getAmountAfterTax(data))
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

  filterResults() {
    if (this.conversionOrderCheckbox.value) {
      this.backupDatasource = this.dataSource.data;
      this.dataSource.data = this.dataSource.data.filter((data) =>
        data?.fibrePODts?.some((fibre: any) => !fibre.poNo)
      );
    } else {
      this.dataSource.data = this.backupDatasource;
    }
    this.table.renderRows();
  }
}
