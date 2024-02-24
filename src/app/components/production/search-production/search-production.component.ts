import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { YarnShade } from 'src/app/models/yarnShade';
import { ConversionService } from 'src/app/services/conversion.service';
import { MasterService } from 'src/app/services/master.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { YarnBlend } from 'src/app/models/yarnBlend';
import { ProductionEntry } from 'src/app/models/productionEntry';
import { ProductionDetailsComponent } from './production-details/production-details.component';

@Component({
  selector: 'app-search-production',
  templateUrl: './search-production.component.html',
  styleUrls: ['./search-production.component.scss'],
})
export class SearchProductionComponent {
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>();
  shadeList!: YarnShade[];
  blendList!: YarnBlend[];
  columnsToDisplay = [
    'productionDate',
    'programId',
    'programNo',
    'programDate',
    'mixingId',
    'shadeName',
    'blendName',
    'action',
  ];
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
    private navigationService: NavigationService,
    public appSharedService: AppSharedService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private masterService: MasterService,
    private conversionService: ConversionService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.navigationService.menu = PRODUCTION;
    this.navigationService.setFocus(Constants.PRODUCTION);
  }

  ngOnInit(): void {
    this.setMinDate();
    this.subscription.add(
      this.masterService.getYarnShade().subscribe({
        next: (data) => (this.shadeList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.subscription.add(
      this.masterService.getYarnBlend().subscribe({
        next: (data) => (this.blendList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );

    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      lot: ['', Validators.required],
      shadeId: '',
      blendId: '',
    });

    const savedSearch = sessionStorage.getItem('search-production');
    sessionStorage.removeItem('search-production');
    if (savedSearch) {
      this.form.patchValue(JSON.parse(savedSearch));
      this.onSearch();
    }
  }

  setMinDate() {
    this.minDate.setMonth(this.minDate.getMonth() - 12);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    if (this.form.invalid) {
      this.notificationService.notify(
        'Error occured in search details!',
        NotifyType.ERROR
      );
      this.form.markAllAsTouched();
      return;
    }
    this.loader = true;
    const { startDate, endDate, lot, shadeId, blendId } = this.form.value;
    this.conversionService
      .getProductionDetails(
        this.datePipe.transform(startDate, 'dd/MM/yyyy') || '',
        this.datePipe.transform(endDate, 'dd/MM/yyyy') || '',
        lot,
        shadeId,
        blendId
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

  openProductionDetails(production: ProductionEntry) {
    this.dialog.open(ProductionDetailsComponent, {
      data: production,
      minWidth: '65vw',
    });
  }

  onReset() {
    this.form.reset();
  }

  updateProduction(production: ProductionEntry) {
    sessionStorage.setItem('production', JSON.stringify(production));
    sessionStorage.setItem(
      'search-production',
      JSON.stringify(this.form.value)
    );
    this.router.navigateByUrl('/production/update-production-entry');
  }
}
