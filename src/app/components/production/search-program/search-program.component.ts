import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, finalize } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PRODUCTION } from 'src/app/constants/production-menu-values.const';
import { ConversionProgram } from 'src/app/models/conversionProgram';
import { NotifyType } from 'src/app/models/notify';
import { YarnShade } from 'src/app/models/yarnShade';
import { ConversionService } from 'src/app/services/conversion.service';
import { MasterService } from 'src/app/services/master.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-program',
  templateUrl: './search-program.component.html',
  styleUrls: ['./search-program.component.scss'],
})
export class SearchProgramComponent {
  form!: FormGroup;
  subscription = new Subscription();
  dataSource = new MatTableDataSource<any>();
  shadeList!: YarnShade[];
  columnsToDisplay = [
    'programId',
    'programNo',
    'programDate',
    'shadeName',
    'blendName',
    'remarks',
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

    this.form = this.formBuilder.group({
      shadeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    const savedSearch = sessionStorage.getItem('search-program');
    sessionStorage.removeItem('search-program');
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
    const { shadeId, startDate, endDate } = this.form.value;
    this.conversionService
      .getConversionProgramsByShade(
        shadeId,
        this.datePipe.transform(startDate, 'dd/MM/yyyy') || '',
        this.datePipe.transform(endDate, 'dd/MM/yyyy') || ''
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

  openProgramDetails(programDetails: ConversionProgram) {
    sessionStorage.setItem('search-program', JSON.stringify(this.form.value));
    this.dialog.open(ProgramDetailsComponent, {
      data: programDetails,
      minWidth: '70vw',
      maxWidth: '90vw',
    });
  }

  onReset() {
    this.form.reset();
  }

  updateProgram(program: ConversionProgram) {
    sessionStorage.setItem('program', JSON.stringify(program));
    sessionStorage.setItem('search-program', JSON.stringify(this.form.value));
    this.router.navigateByUrl('/production/update-program');
  }
}
