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

@Component({
  selector: 'app-fibre-dashboard',
  templateUrl: './fibre-dashboard.component.html',
  styleUrls: ['./fibre-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FibreDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  columnsToDisplay = ['expand', 'poNo', 'party', 'poStatus', 'poDate'];
  innerDisplayedColumns = ['receivedDc', 'fibre', 'shade', 'kgs', 'amount'];
  expandedElement: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loader = false;

  constructor(
    public partyService: PartyService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.navigationService.isSidenavOpened = true;
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.partyService
        .getParties()
        .subscribe((data) => (this.partyService.parties = data))
    );

    this.form = this.formBuilder.group({
      partyId: '',
      poType: '',
      poStartDate: '',
      poEndDate: '',
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    // API call to be implementated
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }

  onReset() {
    this.form.reset();
  }

  addPO() {
    this.router.navigateByUrl('/purchases/fibre/fibre-new-purchase-order');
  }

  addOrUpdateInvoice() {
    this.router.navigateByUrl('/purchases/fibre/fibre-receive-purchase-order');
  }

  updatePO() {
    this.router.navigateByUrl('/purchases/fibre/fibre-new-purchase-order');
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
    party: 'party1',
    poStatus: 'Delivered',
    poDate: '02/02/2023',
    invoices: [
      {
        receivedDc: 1,
        fibre: 'cotton',
        shade: 'white',
        kgs: 12,
        amount: 25000,
      },
      {
        receivedDc: 2,
        fibre: 'silk',
        shade: 'blue',
        kgs: 20,
        amount: 35000,
      },
    ],
  },
  {
    poNo: '124/GA/23',
    party: 'party2',
    poStatus: 'Pending',
    poDate: '02/02/2023',
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
        fibre: 'cotton',
        shade: 'white',
        kgs: 12,
        amount: 25000,
      },
    ],
  },
  {
    poNo: '128/GA/23',
    party: 'party5',
    poStatus: 'Pending',
    poDate: '02/02/2023',
    invoices: [
      {
        receivedDc: 1,
        fibre: 'cotton',
        shade: 'white',
        kgs: 12,
        amount: 25000,
      },
      {
        receivedDc: 2,
        fibre: 'Silk',
        shade: 'blue',
        kgs: 22,
        amount: 55000,
      },
    ],
  },
  {
    poNo: '129/GA/23',
    party: 'party6',
    poStatus: 'Pending',
    poDate: '02/02/2023',
    invoices: [],
  },
];
