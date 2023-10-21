import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { NotifyType } from 'src/app/models/notify';
import { YarnBlend } from 'src/app/models/yarnBlend';
import { YarnCounts } from 'src/app/models/yarnCounts';
import { YarnDeliverySearchResult } from 'src/app/models/yarnDeliverySearchResult';
import { YarnShade } from 'src/app/models/yarnShade';
import { MasterService } from 'src/app/services/master.service';
import { PartyService } from 'src/app/services/party.service';
import { YarnService } from 'src/app/services/yarn.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-choose-delivery-for-return',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './choose-delivery-for-return.component.html',
  styleUrls: ['./choose-delivery-for-return.component.scss'],
})
export class ChooseDeliveryForReturnComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  dataSource: YarnDeliverySearchResult[] = [];
  selection = new SelectionModel<YarnDeliverySearchResult>(true, []);
  displayedColumns = [
    'dcNo',
    'dcDate',
    'partyName',
    'counts',
    'shade',
    'blend',
    'lot',
    'deliveredQuantity',
    'select',
  ];
  subscription = new Subscription();
  loader = false;
  party = new FormControl();
  countsList!: YarnCounts[];
  shadeList!: YarnShade[];
  blendList!: YarnBlend[];

  constructor(
    private notificationService: NotificationService,
    private matDialogRef: MatDialogRef<any>,
    private masterService: MasterService,
    private yarnService: YarnService,
    public partyService: PartyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      partyId: ['', Validators.required],
      blendId: '',
      shadeId: '',
      countsId: '',
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

    this.subscription.add(
      this.masterService.getYarnCounts().subscribe({
        next: (data) => (this.countsList = data),
        error: (error) => {
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          );
        },
      })
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submit() {
    if (this.party.invalid) {
      this.notificationService.notify(
        'Please select a party',
        NotifyType.ERROR
      );
      return;
    }
    if (this.selection.selected.length === 0) {
      this.notificationService.notify(
        'Please select delivery to continue',
        NotifyType.ERROR
      );
      return;
    }
    this.matDialogRef.close(this.selection.selected);
  }

  close() {
    this.matDialogRef.close();
  }

  onSearch() {
    if (this.form.invalid) {
      this.notificationService.notify(
        'Please select party to search',
        NotifyType.ERROR
      );
      return;
    }
    this.loader = true;
    this.selection.clear();
    this.subscription.add(
      this.yarnService
        .searchYarnDeliveries(this.form.value)
        .pipe(finalize(() => (this.loader = false)))
        .subscribe({
          next: (data) => (this.dataSource = data),
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  onReset() {
    this.form.reset();
    this.dataSource = [];
  }
}
