import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
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
export class FibreSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  columnsToDisplay = ['expand', 'poNo', 'party', 'poStatus', 'poDate'];
  innerDisplayedColumns = [
    'receivedDc',
    'receivedDate',
    'fibre',
    'shade',
    'orderQty',
    'receivedQty',
    'amount',
  ];
  expandedElement: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loader = false;
  minDate = new Date();
  maxDate = new Date();

  constructor(
    public partyService: PartyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private router: Router,
    public appSharedService: AppSharedService,
    private notificationService: NotificationService
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.setMinDate();
    this.subscription.add(
      this.partyService.getParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(error?.error || error?.message),
      })
    );

    this.form = this.formBuilder.group({
      partyId: '',
      poStatus: '',
      poStartDate: '',
      poEndDate: '',
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'poDate': {
          const split = item?.poDate?.split('/');
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
    // API call to be implementated
    this.loader = true;
    // TEMP - start
    if (this.form.get('poStatus')?.value) {
      this.dataSource.data = ELEMENT_DATA.filter(
        (data) =>
          this.form.get('poStatus')?.value?.toLowerCase() ===
          data.poStatus?.toLowerCase()
      );
    } else {
      this.dataSource.data = ELEMENT_DATA;
    }
    setTimeout(() => {
      this.loader = false;
    }, 500);
    // TEMP - end
  }

  onReset() {
    this.form.reset();
  }

  addPO() {
    this.router.navigateByUrl('/purchases/fibre/new-purchase-order');
  }

  receivePO() {
    this.router.navigateByUrl('/purchases/fibre/receive-purchase-order');
  }

  updatePO() {
    this.router.navigateByUrl('/purchases/fibre/new-purchase-order');
  }

  getTotal(invoice: any[], property: string) {
    return invoice
      .map((data: any) => data[property])
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

// mock datas
const ELEMENT_DATA: any[] = [
  {
    poNo: '123/GA/23',
    party: 'party7',
    poStatus: 'Received',
    poDate: '02/01/2023',
    invoices: [
      {
        receivedDc: 1,
        receivedDate: '02/02/2023',
        fibre: 'cotton',
        shade: 'white',
        orderQty: 12,
        receivedQty: 12,
        amount: 25000,
      },
      {
        receivedDc: 2,
        receivedDate: '06/02/2023',
        fibre: 'silk',
        shade: 'blue',
        orderQty: 20,
        receivedQty: 20,
        amount: 35000,
      },
    ],
  },
  {
    poNo: '124/GA/23',
    party: 'party9',
    poStatus: 'Pending',
    poDate: '23/02/2023',
    invoices: [],
  },
  {
    poNo: '127/GA/23',
    party: 'party5',
    poStatus: 'Pending',
    poDate: '02/02/2023',
    invoices: [
      {
        receivedDc: 1,
        receivedDate: '02/03/2023',
        fibre: 'cotton',
        shade: 'white',
        orderQty: 12,
        receivedQty: 8,
        amount: 25000,
      },
    ],
  },
  {
    poNo: '128/GA/23',
    party: 'party4',
    poStatus: 'Pending',
    poDate: '02/10/2022',
    invoices: [
      {
        receivedDc: 1,
        receivedDate: '02/02/2023',
        fibre: 'cotton',
        shade: 'white',
        orderQty: 12,
        receivedQty: 7,
        amount: 15000,
      },
      {
        receivedDc: 2,
        receivedDate: '02/02/2023',
        fibre: 'cotton',
        shade: 'white',
        orderQty: 12,
        receivedQty: 5,
        amount: 10000,
      },
      {
        receivedDc: 3,
        receivedDate: '02/02/2023',
        fibre: 'Silk',
        shade: 'blue',
        orderQty: 20,
        receivedQty: 10,
        amount: 55000,
      },
    ],
  },
  {
    poNo: '129/GA/23',
    party: 'party2',
    poStatus: 'Cancelled',
    poDate: '03/02/2023',
    invoices: [],
  },
];
