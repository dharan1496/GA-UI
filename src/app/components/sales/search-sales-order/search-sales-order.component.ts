import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize, map } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { SALES } from 'src/app/constants/sales-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { OrderDetailsComponent } from './order-details/order-details.component';

@Component({
  selector: 'app-search-sales-order',
  templateUrl: './search-sales-order.component.html',
  styleUrls: ['./search-sales-order.component.scss'],
})
export class SearchSalesOrderComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = [
    'orderId',
    'orderNo',
    'partyName',
    'orderDate',
    'receivedDate',
    'brokerName',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loader = false;
  minDate = new Date();
  maxDate = new Date();

  constructor(
    public partyService: PartyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public appSharedService: AppSharedService,
    private notificationService: NotificationService,
    private yarnService: YarnService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    this.navigationService.menu = SALES;
    this.navigationService.setFocus(Constants.SALES);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      filterBy: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(value: string) {
    if (value === 'party') {
      this.form.addControl('partyId', new FormControl('', Validators.required));
      this.form?.removeControl('startDate');
      this.form?.removeControl('endDate');
      this.form?.removeControl('orderId');
    } else if (value === 'date') {
      this.form.addControl(
        'startDate',
        new FormControl('', Validators.required)
      );
      this.form.addControl('endDate', new FormControl('', Validators.required));
      this.form?.removeControl('partyId');
      this.form?.removeControl('orderId');
    } else if (value === 'orderId') {
      this.form.addControl('orderId', new FormControl('', Validators.required));
      this.form?.removeControl('partyId');
      this.form?.removeControl('startDate');
      this.form?.removeControl('endDate');
    }
  }

  setMinDate() {
    this.minDate.setMonth(this.minDate.getMonth() - 12);
  }

  onSearch() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please select the filter to search',
        NotifyType.ERROR
      );
      return;
    }
    this.loader = true;
    const filter = this.form.get('filterBy')?.value;
    let observable;
    if (filter === 'party') {
      observable = this.yarnService.getYarnOrderListByParty(
        this.form.get('partyId')?.value
      );
    } else if (filter === 'orderId') {
      observable = this.yarnService
        .getYarnOrderDetailsById(this.form.get('orderId')?.value)
        .pipe(map((data) => [data]));
    } else if (filter === 'date') {
      observable = this.yarnService.getYarnOrderListByDate(
        this.datePipe.transform(
          this.form.get('startDate')?.value,
          'dd/MM/yyyy'
        ) || '',
        this.datePipe.transform(
          this.form.get('endDate')?.value,
          'dd/MM/yyyy'
        ) || ''
      );
    }
    observable?.pipe(finalize(() => (this.loader = false)))?.subscribe({
      next: (data) => {
        const orders = data.map((order) => ({
          ...order,
          partyName: this.getParty(order.partyId),
        }));
        this.dataSource = new MatTableDataSource<any>(orders);
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.dataSource = new MatTableDataSource<any>([]);
        this.notificationService.error(
          typeof error?.error === 'string' ? error?.error : error?.message
        );
      },
    });
  }

  onReset() {
    this.form.reset();
  }

  getParty(id: number): string {
    return (
      this.partyService.parties.find((party) => party.partyId === id)
        ?.partyName || ''
    );
  }

  openOrderDetails(row: any) {
    this.dialog.open(OrderDetailsComponent, { data: row, minWidth: 900 });
  }
}
