import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { PARTY } from 'src/app/constants/party-menu-values.const';
import { City } from 'src/app/models/city';
import { District } from 'src/app/models/district';
import { NotifyType } from 'src/app/models/notify';
import { State } from 'src/app/models/state';
import { PartyService } from 'src/app/services/party.service';
import { AppSharedService } from 'src/app/shared/app-shared.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-add-party',
  templateUrl: './add-party.component.html',
  styleUrls: ['./add-party.component.scss'],
})
export class AddPartyComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  stateList!: State[];
  cityList!: City[];
  districtList!: District[];
  edit = false;
  subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public appSharedService: AppSharedService,
    private navigationService: NavigationService,
    private partyService: PartyService,
    private router: Router
  ) {
    this.navigationService.setFocus(Constants.PARTY);
    this.navigationService.menu = PARTY;
  }

  ngOnInit() {
    this.getDropdownData();
    this.form = this.formBuilder.group({
      partyName: ['', Validators.required],
      branchName: ['', Validators.required],
      gstNo: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      address3: '',
      districtId: ['', Validators.required],
      cityId: ['', Validators.required],
      stateId: ['', Validators.required],
      pinCode: ['', Validators.required],
      eMailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      mobileNo: ['', Validators.required],
      landline: '',
    });

    if (this.partyService.editPartyDetails) {
      this.edit = true;
      const contact = this.partyService.editPartyDetails.contactNo?.split(',');
      this.form.patchValue({
        ...this.partyService.editPartyDetails,
        mobileNo: contact?.length ? contact[0]?.trim() : '',
        landline: contact?.length ? contact[1]?.trim() : '',
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDropdownData() {
    this.subscription.add(
      this.partyService.getStates().subscribe({
        next: (states) => (this.stateList = states),
        error: (error) =>
          this.notificationService.error(error?.error || error?.message),
      })
    );
    this.subscription.add(
      this.partyService.getCities().subscribe({
        next: (cities) => (this.cityList = cities),
        error: (error) =>
          this.notificationService.error(error?.error || error?.message),
      })
    );
    this.subscription.add(
      this.partyService.getDistricts().subscribe({
        next: (districts) => (this.districtList = districts),
        error: (error) =>
          this.notificationService.error(error?.error || error?.message),
      })
    );
  }

  submitParty() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.notify(
        'Error occured in the party details!',
        NotifyType.ERROR
      );
      return;
    }

    const mobile = this.form.get('mobileNo')?.value;
    const landline = this.form.get('landline')?.value;
    const partyRequest = {
      ...this.form.value,
      contactNo: landline ? `${mobile}, ${landline}` : mobile,
      createdByUserId: 0,
    };
    delete partyRequest?.mobileNo;
    delete partyRequest?.landline;

    if (this.edit) {
      this.partyService
        .updateParty({
          ...partyRequest,
          partyId: this.partyService.editPartyDetails?.partyId,
          cityName: '',
          districtName: '',
          stateName: '',
        })
        .subscribe({
          next: (response) => {
            this.partyService.editPartyDetails = undefined;
            this.notificationService
              .success(response)
              .afterClosed()
              .subscribe(() => this.router.navigateByUrl('/party'));
          },
          error: (error) =>
            this.notificationService.error(error?.error || error.message),
        });
      return;
    }

    this.partyService.addParty(partyRequest).subscribe({
      next: () => {
        this.notificationService.success('Party added successfully!');
        this.resetData();
      },
      error: (error) =>
        this.notificationService.error(error?.error || error.message),
    });
  }

  resetData() {
    this.form.reset();
  }
}
