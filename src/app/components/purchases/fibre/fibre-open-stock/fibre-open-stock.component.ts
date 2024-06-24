import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PURCHASE } from 'src/app/constants/purchase-menu-values.const';
import { NotifyType } from 'src/app/models/notify';
import { FibreService } from 'src/app/services/fibre.service';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { OpeningStockFibreDts } from 'src/app/models/openingStockFibreDts';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FibreShade } from 'src/app/models/fibreShade';

@Component({
  selector: 'app-fibre-open-stock',
  templateUrl: './fibre-open-stock.component.html',
  styleUrls: ['./fibre-open-stock.component.scss'],
})
export class FibreOpenStockComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  editStockDetails!: OpeningStockFibreDts | null;
  form!: FormGroup;
  fibreShadeList!: FibreShade[];

  constructor(
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    public partyService: PartyService,
    public fibreService: FibreService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.navigationService.setFocus(Constants.PURCHASES);
    this.navigationService.menu = PURCHASE;
  }

  ngOnInit(): void {
    this.getPartyList();
    this.getFibreList();
    this.getShade();

    this.form = this.formBuilder.group({
      receivedDCId: '',
      stockAddedDate: '',
      receivedDtsId: '',
      availableBalance: '',
      fiberTypeId: ['', Validators.required],
      fiberTypeName: '',
      fiberShadeName: '',
      fiberShadeId: ['', Validators.required],
      hsnCode: '',
      stockWeight: ['', Validators.required],
      stockBales: ['', Validators.required],
      lot: ['', Validators.required],
    });

    this.subscription.add(
      this.form.get('fiberTypeId')?.valueChanges.subscribe((fibreTypeId) => {
        const filteredFibre = this.fibreService.fibres?.filter(
          (fibre) => fibre.fibreTypeId === fibreTypeId
        );
        this.form
          .get('fiberTypeName')
          ?.setValue(filteredFibre.reduce((p, c) => c.fibreType, ''));
      })
    );

    if (this.router.url.includes('edit-stock')) {
      this.patchData();
    }
  }

  patchData() {
    const stockDetails = sessionStorage.getItem('editStock');
    if (stockDetails) {
      this.editStockDetails = JSON.parse(stockDetails);
      this.form.patchValue(this.editStockDetails || {});
      this.form.get('fiberTypeId')?.disable();
      this.form.get('fiberShadeId')?.disable();
      this.form.updateValueAndValidity();
      sessionStorage.removeItem('editStock');
    } else {
      this.router.navigateByUrl('/purchases/fibre/open-stock');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPartyList() {
    this.subscription.add(
      this.partyService.getFibreParties().subscribe({
        next: (data) => (this.partyService.parties = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  getFibreList() {
    this.subscription.add(
      this.fibreService.getFibres().subscribe({
        next: (data) => (this.fibreService.fibres = data),
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  getShade() {
    this.subscription.add(
      this.fibreService.getFibreShade().subscribe({
        next: (data) => {
          this.fibreShadeList = data;
          this.subscription.add(
            this.form.get('fiberShadeId')?.valueChanges.subscribe((shadeId) => {
              const filteredShade = this.fibreShadeList?.filter(
                (shade) => shade.shadeId === shadeId
              );
              this.form
                .get('fiberShadeName')
                ?.setValue(filteredShade.reduce((p, c) => c.shadeName, ''));
            })
          );
        },
        error: (error) =>
          this.notificationService.error(
            typeof error?.error === 'string' ? error?.error : error?.message
          ),
      })
    );
  }

  submitOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please fix the error to submit!',
        NotifyType.ERROR
      );
      return;
    }

    this.subscription.add(
      this.fibreService.receiveFiberOpeningStock([this.form.value]).subscribe({
        next: (response) => {
          this.notificationService.success(response);
          this.resetData();
        },
        error: (error) => {
          this.notificationService.error(error.message);
        },
      })
    );
  }

  formatDate(date: string) {
    if (!date) {
      return '';
    }

    const splittedDate = date?.split(' ')[0]?.split('/');

    return `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`;
  }

  updateOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Please fix the error to submit!',
        NotifyType.ERROR
      );
      return;
    }

    const stockDetails = this.form.value as OpeningStockFibreDts;

    this.subscription.add(
      this.fibreService
        .updateFiberOpeningStock([stockDetails], stockDetails.receivedDCId)
        .subscribe({
          next: (response) => {
            if (response === 'true') {
              this.resetData();
              this.notificationService.success('Updated successfully!');
            } else {
              this.notificationService.error('Unable to update the details!');
            }
          },
          error: (error) =>
            this.notificationService.error(
              typeof error?.error === 'string' ? error?.error : error?.message
            ),
        })
    );
  }

  resetData() {
    this.form.reset();
    this.editStockDetails = null;
    this.form.get('fiberTypeId')?.enable();
    this.form.get('fiberShadeId')?.enable();
  }
}
